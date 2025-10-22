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
  birthChart: {
    sunSign: string
    moonSign: string
    risingSign: string
    planets: Record<string, any>
    houses: Record<string, any>
  }
}

/**
 * Upload JSON metadata to Pinata IPFS
 */
export async function uploadToPinata(metadata: BirthChartMetadata): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
  const secretKey = process.env.PINATA_SECRET_KEY

  if (!apiKey || !secretKey) {
    throw new Error('Pinata API keys not configured')
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretKey
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
 * Get IPFS gateway URL from IPFS URI
 */
export function getIPFSUrl(ipfsUri: string): string {
  if (ipfsUri.startsWith('ipfs://')) {
    const hash = ipfsUri.replace('ipfs://', '')
    return `https://gateway.pinata.cloud/ipfs/${hash}`
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
