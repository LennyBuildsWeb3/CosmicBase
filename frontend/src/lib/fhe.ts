/**
 * FHE (Fully Homomorphic Encryption) utilities for CosmicBase
 * Uses Zama's FHEVM for encrypting birth data before storing on-chain
 */

import { type Address, type PublicClient, type WalletClient } from 'viem'

// FHEVM SDK types - using any for flexibility with SDK version changes
type FhevmInstance = any

export interface BirthDataToEncrypt {
  year: number      // 1900-2100
  month: number     // 1-12
  day: number       // 1-31
  hour: number      // 0-23
  minute: number    // 0-59
  latitude: number  // -90 to 90
  longitude: number // -180 to 180
}

export interface EncryptedBirthData {
  encryptedYear: Uint8Array
  encryptedMonth: Uint8Array
  encryptedDay: Uint8Array
  encryptedHour: Uint8Array
  encryptedMinute: Uint8Array
  encryptedLatitude: Uint8Array
  encryptedLongitude: Uint8Array
  inputProof: Uint8Array
}

// Sepolia chain ID for reference
export const SEPOLIA_CHAIN_ID = 11155111

let fhevmInstance: FhevmInstance | null = null
let sdkInitialized = false

/**
 * Initialize FHEVM instance
 * Must be called before encrypting data
 */
export async function initFhevm(): Promise<FhevmInstance> {
  if (fhevmInstance) {
    return fhevmInstance
  }

  try {
    // Set up global polyfills for relayer SDK
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.global = window;
      // @ts-ignore
      window.process = window.process || { env: {} };
    }

    // Dynamic import of relayer SDK (web version for browser)
    const { initSDK, createInstance, SepoliaConfig } = await import('@zama-fhe/relayer-sdk/web')

    // Initialize the WASM SDK first (required before createInstance)
    if (!sdkInitialized) {
      console.log('Initializing FHEVM SDK...')
      await initSDK()
      sdkInitialized = true
      console.log('FHEVM SDK initialized successfully')
    }

    // Create instance using the built-in SepoliaConfig
    console.log('Creating FHEVM instance with SepoliaConfig...')

    // Use Infura if API key is available, otherwise use public RPC
    const network = process.env.NEXT_PUBLIC_INFURA_API_KEY
      ? `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
      : 'https://ethereum-sepolia-rpc.publicnode.com'

    fhevmInstance = await createInstance({
      ...SepoliaConfig,
      network,
    })
    console.log('FHEVM instance created successfully')

    return fhevmInstance
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error)
    throw new Error('FHEVM initialization failed')
  }
}

/**
 * Encrypt birth data for on-chain storage
 */
export async function encryptBirthData(
  birthData: BirthDataToEncrypt,
  contractAddress: Address,
  userAddress: Address
): Promise<EncryptedBirthData> {
  const instance = await initFhevm()

  // Convert latitude and longitude to positive integers with offset
  // Latitude: -90 to 90 -> 0 to 1800000 (after *10000 and +900000)
  // Longitude: -180 to 180 -> 0 to 3600000 (after *10000 and +1800000)
  const latitudeInt = Math.round(birthData.latitude * 10000) + 900000
  const longitudeInt = Math.round(birthData.longitude * 10000) + 1800000

  console.log('Creating encrypted input with converted coordinates:', {
    latitudeInt,
    longitudeInt,
    originalLat: birthData.latitude,
    originalLong: birthData.longitude
  })

  // Create encrypted input
  const input = instance.createEncryptedInput(contractAddress, userAddress)

  // Add all birth data fields in the correct order
  // Order must match contract function signature
  input.add16(birthData.year)      // euint16
  input.add8(birthData.month)      // euint8
  input.add8(birthData.day)        // euint8
  input.add8(birthData.hour)       // euint8
  input.add8(birthData.minute)     // euint8
  input.add32(latitudeInt)         // euint32
  input.add32(longitudeInt)        // euint32

  console.log('Encrypting inputs...')

  // Encrypt all inputs (returns Promise in v0.3.0)
  const encrypted = await input.encrypt()

  console.log('Encryption result:', {
    handlesCount: encrypted.handles?.length,
    hasInputProof: !!encrypted.inputProof,
    inputProofLength: encrypted.inputProof?.length
  })

  // Validate that we have all required handles
  if (!encrypted.handles || encrypted.handles.length < 7) {
    throw new Error(`Expected 7 handles, got ${encrypted.handles?.length || 0}`)
  }

  if (!encrypted.inputProof || encrypted.inputProof.length === 0) {
    throw new Error('Input proof is empty or missing')
  }

  return {
    encryptedYear: encrypted.handles[0],
    encryptedMonth: encrypted.handles[1],
    encryptedDay: encrypted.handles[2],
    encryptedHour: encrypted.handles[3],
    encryptedMinute: encrypted.handles[4],
    encryptedLatitude: encrypted.handles[5],
    encryptedLongitude: encrypted.handles[6],
    inputProof: encrypted.inputProof,
  }
}

/**
 * Generate EIP-712 token for reencryption
 * Required for decrypting data on the frontend
 */
export async function generateReencryptionToken(
  contractAddress: Address,
  walletClient: WalletClient
): Promise<{ publicKey: Uint8Array; signature: string }> {
  const instance = await initFhevm()

  if (!walletClient.account) {
    throw new Error('Wallet not connected')
  }

  const token = await instance.generatePublicKey({
    verifyingContract: contractAddress,
  })

  return token
}

/**
 * Request decryption of encrypted value
 * Uses the relayer SDK for self-relaying decryption
 */
export async function requestDecryption(
  contractAddress: Address,
  encryptedHandle: bigint,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<bigint> {
  const instance = await initFhevm()

  try {
    const decryptedValue = await instance.decrypt(contractAddress, encryptedHandle)
    return decryptedValue
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Failed to decrypt value')
  }
}

/**
 * Batch decrypt multiple encrypted values
 */
export async function batchDecrypt(
  contractAddress: Address,
  encryptedHandles: bigint[]
): Promise<bigint[]> {
  const instance = await initFhevm()

  const decryptedValues = await Promise.all(
    encryptedHandles.map(handle => instance.decrypt(contractAddress, handle))
  )

  return decryptedValues
}

/**
 * Validate birth data before encryption
 */
export function validateBirthDataForEncryption(data: BirthDataToEncrypt): string | null {
  if (data.year < 1900 || data.year > 2100) {
    return 'Year must be between 1900 and 2100'
  }
  if (data.month < 1 || data.month > 12) {
    return 'Invalid month'
  }
  if (data.day < 1 || data.day > 31) {
    return 'Invalid day'
  }
  if (data.hour < 0 || data.hour > 23) {
    return 'Invalid hour'
  }
  if (data.minute < 0 || data.minute > 59) {
    return 'Invalid minute'
  }
  if (data.latitude < -90 || data.latitude > 90) {
    return 'Invalid latitude'
  }
  if (data.longitude < -180 || data.longitude > 180) {
    return 'Invalid longitude'
  }
  return null
}

/**
 * Convert decrypted coordinates back to decimal
 */
export function decodeCoordinates(latInt: bigint, longInt: bigint): { latitude: number; longitude: number } {
  return {
    latitude: (Number(latInt) - 900000) / 10000,
    longitude: (Number(longInt) - 1800000) / 10000,
  }
}

/**
 * Check if FHEVM is available on the current network
 */
export async function isFhevmAvailable(chainId: number): Promise<boolean> {
  return chainId === SEPOLIA_CHAIN_ID
}
