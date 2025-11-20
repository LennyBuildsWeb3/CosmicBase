import { Address } from 'viem'

// FHE Contract address - Ethereum Sepolia
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_FHE_CONTRACT_ADDRESS || '0x44e01c6A4C40F7DF7bd2d91bA1E1efA70c104C69') as Address

// Re-export from FHE contract config
export { FHE_CONTRACT_ABI as CONTRACT_ABI, formatEncryptedInputsForContract } from './contract-fhe'

// Zodiac sign names for display
export const ZODIAC_SIGNS = [
  '', // 0 - empty
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]
