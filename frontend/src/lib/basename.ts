import { normalize } from 'viem/ens'
import { Address } from 'viem'

/**
 * Get ENS name for an address
 * @param address - Ethereum address to resolve
 * @param chainId - Chain ID (11155111 for Sepolia)
 * @returns ENS name or null if not found
 */
export async function getBasename(
  address: Address,
  chainId: number = 11155111
): Promise<string | null> {
  // ENS resolution is not available on Sepolia testnet
  // Return null to gracefully fallback to address display
  return null
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
 * Get explorer URL for name/address
 * @param name - Name or address to link to
 * @param chainId - Chain ID
 * @returns URL to explorer
 */
export function getBasenameUrl(name: string, chainId: number = 11155111): string {
  // Return Etherscan Sepolia
  return `https://sepolia.etherscan.io/`
}
