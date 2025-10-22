import { Address } from 'viem'

// Contract address from env
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '') as Address

// CosmicBaseNFT ABI - Only the functions we need
export const CONTRACT_ABI = [
  {
    inputs: [
      { name: '_birthDataHash', type: 'bytes32' },
      { name: '_metadataURI', type: 'string' },
      { name: '_sunSign', type: 'uint8' },
      { name: '_moonSign', type: 'uint8' },
      { name: '_risingSign', type: 'uint8' }
    ],
    name: 'mintBirthChart',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'hasUserMinted',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getTokenByAddress',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getBirthChart',
    outputs: [
      {
        components: [
          { name: 'birthDataHash', type: 'bytes32' },
          { name: 'metadataURI', type: 'string' },
          { name: 'mintTimestamp', type: 'uint256' },
          { name: 'sunSign', type: 'uint8' },
          { name: 'moonSign', type: 'uint8' },
          { name: 'risingSign', type: 'uint8' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'tokenId1', type: 'uint256' },
      { name: 'tokenId2', type: 'uint256' }
    ],
    name: 'calculateCompatibility',
    outputs: [{ name: 'score', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const

// Zodiac sign names for display
export const ZODIAC_SIGNS = [
  '', // 0 - empty
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]
