import { normalize } from 'viem/ens'
import { Address, createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

// Base L2 Resolver addresses
const L2_RESOLVER_ADDRESS = '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD' // Base Mainnet
const L2_RESOLVER_ADDRESS_SEPOLIA = '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA' // Base Sepolia

/**
 * Get basename for an address using Base L2 Resolver
 * @param address - Ethereum address to resolve
 * @param chainId - Chain ID (8453 for Base, 84532 for Base Sepolia)
 * @returns Basename or null if not found
 */
export async function getBasename(
  address: Address,
  chainId: number = 84532
): Promise<string | null> {
  try {
    // Basenames are only available on Base Mainnet (not Sepolia)
    // Return null for testnet to gracefully fallback to address display
    if (chainId !== 8453) {
      console.log('Basenames only available on Base Mainnet, skipping for testnet')
      return null
    }

    const chain = base
    const resolverAddress = L2_RESOLVER_ADDRESS

    const publicClient = createPublicClient({
      chain,
      transport: http()
    })

    // Reverse resolution: Get the name for an address
    // Using the L2 Resolver's name() function
    const name = await publicClient.readContract({
      address: resolverAddress,
      abi: [
        {
          inputs: [{ name: 'addr', type: 'address' }],
          name: 'name',
          outputs: [{ name: '', type: 'string' }],
          stateMutability: 'view',
          type: 'function'
        }
      ],
      functionName: 'name',
      args: [address]
    }) as string

    // If name exists and is valid, return it
    if (name && name.length > 0) {
      return name
    }

    return null
  } catch (error) {
    console.error('Error fetching basename:', error)
    return null
  }
}

/**
 * Format address or basename for display
 * @param address - Ethereum address
 * @param basename - Optional basename
 * @returns Formatted string
 */
export function formatAddressOrBasename(
  address: Address,
  basename?: string | null
): string {
  if (basename) {
    return basename
  }
  // Return shortened address: 0x1234...5678
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Check if a string is a valid basename
 * @param name - String to check
 * @returns true if valid basename format
 */
export function isValidBasename(name: string): boolean {
  try {
    // Basenames end with .base.eth
    if (!name.endsWith('.base.eth')) {
      return false
    }
    // Try to normalize the name
    normalize(name)
    return true
  } catch {
    return false
  }
}

/**
 * Get basename URL for a name
 * @param basename - Basename to link to
 * @param chainId - Chain ID
 * @returns URL to basename profile
 */
export function getBasenameUrl(basename: string, chainId: number = 84532): string {
  if (chainId === 8453) {
    return `https://www.base.org/name/${basename}`
  }
  // Sepolia doesn't have a public UI, return BaseScan
  return `https://sepolia.basescan.org/`
}
