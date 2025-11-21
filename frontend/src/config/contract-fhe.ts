import { type Address, type Abi, toHex } from 'viem'

// FHE Contract address - deployed to Sepolia
export const FHE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FHE_CONTRACT_ADDRESS as Address || '0xE37743B10BB6E48436072DE66B516A40335E2632' as Address

// FHE CosmicBase NFT ABI
export const FHE_CONTRACT_ABI: Abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'requester', type: 'address' }
    ],
    name: 'BirthDataDecrypted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'metadataURI', type: 'string' },
      { indexed: false, internalType: 'uint8', name: 'sunSign', type: 'uint8' },
      { indexed: false, internalType: 'uint8', name: 'moonSign', type: 'uint8' },
      { indexed: false, internalType: 'uint8', name: 'risingSign', type: 'uint8' }
    ],
    name: 'ChartMinted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'requestId', type: 'uint256' }
    ],
    name: 'DecryptionRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'newMetadataURI', type: 'string' }
    ],
    name: 'MetadataUpdated',
    type: 'event'
  },
  // Mint function with encrypted inputs
  // Note: externalEuint types are bytes32 in Solidity (user-defined value types)
  {
    inputs: [
      { internalType: 'bytes32', name: 'encryptedYear', type: 'bytes32' },
      { internalType: 'bytes32', name: 'encryptedMonth', type: 'bytes32' },
      { internalType: 'bytes32', name: 'encryptedDay', type: 'bytes32' },
      { internalType: 'bytes32', name: 'encryptedHour', type: 'bytes32' },
      { internalType: 'bytes32', name: 'encryptedMinute', type: 'bytes32' },
      { internalType: 'bytes32', name: 'encryptedLat', type: 'bytes32' },
      { internalType: 'bytes32', name: 'encryptedLong', type: 'bytes32' },
      { internalType: 'bytes', name: 'inputProof', type: 'bytes' },
      { internalType: 'string', name: '_metadataURI', type: 'string' },
      { internalType: 'uint8', name: '_sunSign', type: 'uint8' },
      { internalType: 'uint8', name: '_moonSign', type: 'uint8' },
      { internalType: 'uint8', name: '_risingSign', type: 'uint8' }
    ],
    name: 'mintBirthChart',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Get public birth chart data
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getBirthChart',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'metadataURI', type: 'string' },
          { internalType: 'uint256', name: 'mintTimestamp', type: 'uint256' },
          { internalType: 'uint8', name: 'sunSign', type: 'uint8' },
          { internalType: 'uint8', name: 'moonSign', type: 'uint8' },
          { internalType: 'uint8', name: 'risingSign', type: 'uint8' },
          { internalType: 'bool', name: 'hasEncryptedData', type: 'bool' }
        ],
        internalType: 'struct FHECosmicBaseNFT.PublicBirthChart',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Check if user has minted
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'hasUserMinted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Get token by address
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getTokenByAddress',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Total supply
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Calculate compatibility
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId1', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenId2', type: 'uint256' }
    ],
    name: 'calculateCompatibility',
    outputs: [{ internalType: 'uint8', name: 'score', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Request decryption
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'requestBirthDataDecryption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Update metadata URI
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'string', name: 'newMetadataURI', type: 'string' }
    ],
    name: 'updateMetadataURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // ERC721 standard functions
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Transfer functions
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Approval functions
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Stats functions
  {
    inputs: [],
    name: 'areStatsInitialized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  // StatsUpdated event
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'totalMints', type: 'uint256' }
    ],
    name: 'StatsUpdated',
    type: 'event'
  }
] as const

// Helper function to format encrypted input for contract call
// Uses viem's toHex for proper byte conversion
export function formatEncryptedInputsForContract(encryptedData: {
  encryptedYear: Uint8Array
  encryptedMonth: Uint8Array
  encryptedDay: Uint8Array
  encryptedHour: Uint8Array
  encryptedMinute: Uint8Array
  encryptedLatitude: Uint8Array
  encryptedLongitude: Uint8Array
  inputProof: Uint8Array
}) {
  // Log raw data for debugging
  console.log('Formatting encrypted inputs for contract...')
  console.log('Raw handle sizes:', {
    year: encryptedData.encryptedYear?.length,
    month: encryptedData.encryptedMonth?.length,
    day: encryptedData.encryptedDay?.length,
    hour: encryptedData.encryptedHour?.length,
    minute: encryptedData.encryptedMinute?.length,
    lat: encryptedData.encryptedLatitude?.length,
    long: encryptedData.encryptedLongitude?.length,
    proof: encryptedData.inputProof?.length
  })

  // Validate inputs
  const handles = [
    encryptedData.encryptedYear,
    encryptedData.encryptedMonth,
    encryptedData.encryptedDay,
    encryptedData.encryptedHour,
    encryptedData.encryptedMinute,
    encryptedData.encryptedLatitude,
    encryptedData.encryptedLongitude
  ]

  for (let i = 0; i < handles.length; i++) {
    if (!handles[i] || handles[i].length === 0) {
      throw new Error(`Handle at index ${i} is empty or undefined`)
    }
  }

  if (!encryptedData.inputProof || encryptedData.inputProof.length === 0) {
    throw new Error('Input proof is empty or undefined')
  }

  // Convert Uint8Array handles to hex strings
  // Handles from relayer SDK are already 32 bytes, don't add extra padding
  const formatted = [
    toHex(encryptedData.encryptedYear),      // bytes32 - already 32 bytes
    toHex(encryptedData.encryptedMonth),     // bytes32 - already 32 bytes
    toHex(encryptedData.encryptedDay),       // bytes32 - already 32 bytes
    toHex(encryptedData.encryptedHour),      // bytes32 - already 32 bytes
    toHex(encryptedData.encryptedMinute),    // bytes32 - already 32 bytes
    toHex(encryptedData.encryptedLatitude),  // bytes32 - already 32 bytes
    toHex(encryptedData.encryptedLongitude), // bytes32 - already 32 bytes
    toHex(encryptedData.inputProof),         // bytes (variable length)
  ] as const

  console.log('Formatted hex values:', {
    year: formatted[0],
    month: formatted[1],
    day: formatted[2],
    hour: formatted[3],
    minute: formatted[4],
    lat: formatted[5],
    long: formatted[6],
    proofLength: formatted[7].length
  })

  return formatted
}
