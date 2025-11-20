/**
 * Pinata IPFS Integration
 * Functions for uploading birth chart metadata to IPFS
 */

export interface BirthChartMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  // Privacy-focused: Only store chart visualization, not full chart data
  // Full chart calculations are done client-side and not stored on IPFS
  // This protects users' exact birth date, time, and location
  customization?: {
    displayName: string
    colorTheme: string
    chartStyle: string
    zodiacArtStyle: string
  }
}

/**
 * Upload JSON metadata to Pinata IPFS using REST API
 */
export async function uploadToPinata(metadata: BirthChartMetadata): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT

  if (!jwt) {
    throw new Error('Pinata JWT not configured')
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `CosmicBase-${Date.now()}.json`
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Pinata upload failed: ${errorText}`)
    }

    const data = await response.json()

    // Return IPFS URI
    return `ipfs://${data.IpfsHash}`
  } catch (error) {
    console.error('Pinata upload error:', error)
    throw error
  }
}

/**
 * Upload file to Pinata IPFS using REST API
 */
export async function uploadFileToPinata(file: File): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT

  if (!jwt) {
    throw new Error('Pinata JWT not configured')
  }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const metadata = JSON.stringify({
      name: file.name
    })
    formData.append('pinataMetadata', metadata)

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Pinata file upload failed: ${errorText}`)
    }

    const data = await response.json()

    // Return IPFS URI
    return `ipfs://${data.IpfsHash}`
  } catch (error) {
    console.error('Pinata file upload error:', error)
    throw error
  }
}

/**
 * Upload blob to Pinata IPFS
 */
export async function uploadBlobToPinata(blob: Blob, filename: string): Promise<string> {
  const file = new File([blob], filename, { type: blob.type })
  return uploadFileToPinata(file)
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
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${sunSign}-${moonSign}-${risingSign}`
}
