/**
 * Test script for Pinata IPFS integration
 * Run with: node test-pinata.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY

async function testPinataConnection() {
  console.log('🧪 Testing Pinata Connection...\n')

  if (!PINATA_JWT) {
    console.error('❌ NEXT_PUBLIC_PINATA_JWT not found in .env.local')
    process.exit(1)
  }

  if (!PINATA_GATEWAY) {
    console.error('❌ NEXT_PUBLIC_PINATA_GATEWAY not found in .env.local')
    process.exit(1)
  }

  console.log('✅ Environment variables loaded')
  console.log(`   Gateway: ${PINATA_GATEWAY}\n`)

  // Test JSON upload
  console.log('📤 Testing JSON metadata upload...')

  const testMetadata = {
    name: 'Test Birth Chart',
    description: 'Test metadata for CosmicBase',
    image: 'ipfs://test',
    attributes: [
      { trait_type: 'Sun Sign', value: 'Aries' },
      { trait_type: 'Moon Sign', value: 'Taurus' }
    ],
    birthChart: {
      sunSign: 'Aries',
      moonSign: 'Taurus',
      risingSign: 'Gemini',
      planets: {},
      houses: {}
    }
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`
      },
      body: JSON.stringify({
        pinataContent: testMetadata,
        pinataMetadata: {
          name: `CosmicBase-Test-${Date.now()}.json`
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${errorText}`)
    }

    const data = await response.json()
    const ipfsUri = `ipfs://${data.IpfsHash}`
    const gatewayUrl = `${PINATA_GATEWAY}/ipfs/${data.IpfsHash}`

    console.log('✅ Upload successful!')
    console.log(`   IPFS Hash: ${data.IpfsHash}`)
    console.log(`   IPFS URI: ${ipfsUri}`)
    console.log(`   Gateway URL: ${gatewayUrl}\n`)

    // Test retrieval
    console.log('📥 Testing metadata retrieval...')
    const retrieveResponse = await fetch(gatewayUrl)

    if (!retrieveResponse.ok) {
      throw new Error('Failed to retrieve metadata')
    }

    const retrievedData = await retrieveResponse.json()
    console.log('✅ Retrieval successful!')
    console.log(`   Retrieved: ${JSON.stringify(retrievedData, null, 2)}\n`)

    console.log('🎉 All tests passed!')
    console.log('\n📝 Summary:')
    console.log(`   - JWT Authentication: ✅`)
    console.log(`   - JSON Upload: ✅`)
    console.log(`   - Gateway Retrieval: ✅`)
    console.log(`   - IPFS Hash: ${data.IpfsHash}`)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Run test
testPinataConnection()
