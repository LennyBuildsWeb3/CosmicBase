/**
 * Pinata IPFS Integration
 * Functions for uploading birth chart metadata to IPFS
 */

import { PinataSDK } from "pinata"

export interface BirthChartMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  birthChart: {
    sunSign: string
    moonSign: string
    risingSign: string
    planets: Record<string, any>
    houses: Record<string, any>
  }
}

/**
 * Initialize Pinata client
 */
function getPinataClient() {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT

  if (!jwt) {
    throw new Error('Pinata JWT not configured')
  }

  return new PinataSDK({
    pinataJwt: jwt
  })
}

/**
 * Upload JSON metadata to Pinata IPFS
 */
export async function uploadToPinata(metadata: BirthChartMetadata): Promise<string> {
  try {
    const pinata = getPinataClient()

    const upload = await pinata.upload.json(metadata, {
      metadata: {
        name: `CosmicBase-${Date.now()}.json`,
        keyvalues: {
          type: 'birth-chart',
          sunSign: metadata.birthChart.sunSign,
          moonSign: metadata.birthChart.moonSign,
          risingSign: metadata.birthChart.risingSign
        }
      }
    })

    // Return IPFS URI
    return `ipfs://${upload.IpfsHash}`
  } catch (error) {
    console.error('Pinata upload error:', error)
    throw error
  }
}

/**
 * Upload file to Pinata IPFS
 */
export async function uploadFileToPinata(file: File): Promise<string> {
  try {
    const pinata = getPinataClient()

    const upload = await pinata.upload.file(file, {
      metadata: {
        name: file.name,
        keyvalues: {
          type: 'chart-image'
        }
      }
    })

    // Return IPFS URI
    return `ipfs://${upload.IpfsHash}`
  } catch (error) {
    console.error('Pinata file upload error:', error)
    throw error
  }
}

/**
 * Get IPFS gateway URL from IPFS URI
 */
export function getIPFSUrl(ipfsUri: string): string {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud'

  if (ipfsUri.startsWith('ipfs://')) {
    const hash = ipfsUri.replace('ipfs://', '')
    return `${gateway}/ipfs/${hash}`
  }
  return ipfsUri
}

/**
 * Generate placeholder image URL for birth chart
 * In production, you'd generate an actual chart visualization
 */
export function generateChartImageUrl(sunSign: string, moonSign: string, risingSign: string): string {
  // For now, return a placeholder
  // TODO: Generate actual birth chart visualization
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${sunSign}-${moonSign}-${risingSign}`
}
