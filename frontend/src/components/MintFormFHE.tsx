'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { type Address } from 'viem'
import { calculateBirthChart, validateBirthData, getSignName, type BirthData } from '@/lib/astrology'
import { encryptBirthData, validateBirthDataForEncryption, initFhevm, type EncryptedBirthData } from '@/lib/fhe'
import { uploadToPinata, uploadBlobToPinata } from '@/lib/pinata'
import { FHE_CONTRACT_ADDRESS, FHE_CONTRACT_ABI, formatEncryptedInputsForContract } from '@/config/contract-fhe'
import { NatalChartSVG } from './chart/NatalChartSVG'
import { svgToBlob } from '@/lib/chartImage'
import { ChartCustomization } from '@/types/customization'

interface MintFormFHEProps {
  onMintSuccess?: (tokenId: bigint) => void
}

export function MintFormFHE({ onMintSuccess }: MintFormFHEProps) {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()

  // Mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Form state
  const [birthData, setBirthData] = useState<BirthData>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    latitude: 0,
    longitude: 0,
  })
  const [locationSearch, setLocationSearch] = useState('')
  const [locationFound, setLocationFound] = useState(false)
  const [displayName, setDisplayName] = useState('')

  // Calculated data
  const [calculatedChart, setCalculatedChart] = useState<ReturnType<typeof calculateBirthChart> | null>(null)
  const [encryptedData, setEncryptedData] = useState<EncryptedBirthData | null>(null)

  // Chart customization
  const [customization] = useState<ChartCustomization>({
    displayName: '',
    colorTheme: 'cosmic-purple',
    chartStyle: 'modern',
    zodiacArtStyle: 'detailed'
  })

  // UI state
  const [step, setStep] = useState<'input' | 'preview' | 'encrypting' | 'uploading' | 'minting'>('input')
  const [error, setError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [metadataURI, setMetadataURI] = useState<string | null>(null)
  const [chartImageBlob, setChartImageBlob] = useState<Blob | null>(null)

  // Contract interaction
  const { data: hash, writeContract, isPending: isWriting, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
    pollingInterval: 2000, // Poll every 2 seconds for faster detection
  })

  // Check if user has already minted and fetch their NFT data
  const [hasAlreadyMinted, setHasAlreadyMinted] = useState(false)
  const [existingNFT, setExistingNFT] = useState<{
    tokenId: bigint
    metadataURI: string
    sunSign: number
    moonSign: number
    risingSign: number
    imageUrl?: string
  } | null>(null)

  useEffect(() => {
    const checkIfMinted = async () => {
      if (!address || !publicClient) return

      try {
        const hasMinted = await publicClient.readContract({
          address: FHE_CONTRACT_ADDRESS,
          abi: FHE_CONTRACT_ABI,
          functionName: 'hasUserMinted',
          args: [address],
        })
        setHasAlreadyMinted(hasMinted as boolean)

        if (hasMinted) {
          // Get user's token ID
          const tokenId = await publicClient.readContract({
            address: FHE_CONTRACT_ADDRESS,
            abi: FHE_CONTRACT_ABI,
            functionName: 'getTokenByAddress',
            args: [address],
          }) as bigint

          // Get birth chart data
          const chartData = await publicClient.readContract({
            address: FHE_CONTRACT_ADDRESS,
            abi: FHE_CONTRACT_ABI,
            functionName: 'getBirthChart',
            args: [tokenId],
          }) as any

          let imageUrl: string | undefined

          // Fetch metadata from IPFS to get image URL
          try {
            const gateway = 'https://dweb.link/ipfs/'
            const metadataUrl = chartData.metadataURI.replace('ipfs://', gateway)
            const response = await fetch(metadataUrl)
            const metadata = await response.json()
            imageUrl = metadata.image?.replace('ipfs://', gateway)
          } catch (err) {
            console.error('Error fetching NFT metadata:', err)
          }

          const nftData = {
            tokenId,
            metadataURI: chartData.metadataURI,
            sunSign: chartData.sunSign,
            moonSign: chartData.moonSign,
            risingSign: chartData.risingSign,
            imageUrl,
          }

          setExistingNFT(nftData)
        }
      } catch (err) {
        console.error('Error checking mint status:', err)
      }
    }

    checkIfMinted()
  }, [address, publicClient])

  // Location search handler
  const searchLocation = useCallback(async () => {
    if (!locationSearch.trim()) return

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=1`
      )
      const data = await response.json()

      if (data.length > 0) {
        setBirthData(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        }))
        setLocationFound(true)
        setError(null)
      } else {
        setError('Location not found. Please try a different search.')
        setLocationFound(false)
      }
    } catch (err) {
      setError('Failed to search location. Please try again.')
      setLocationFound(false)
    }
  }, [locationSearch])

  // Calculate chart when birth data changes
  useEffect(() => {
    if (!locationFound) return

    const validationError = validateBirthData(birthData)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsCalculating(true)
    try {
      const chart = calculateBirthChart(birthData)
      setCalculatedChart(chart)
      setError(null)
    } catch (err) {
      setError('Failed to calculate birth chart')
      setCalculatedChart(null)
    } finally {
      setIsCalculating(false)
    }
  }, [birthData, locationFound])

  // Encrypt birth data
  const handleEncrypt = async () => {
    if (!address || !calculatedChart) return

    const validationError = validateBirthDataForEncryption(birthData)
    if (validationError) {
      setError(validationError)
      return
    }

    // Capture chart image BEFORE changing step (while chart is still visible)
    const chartSvg = document.getElementById('natal-chart-svg')
    if (!chartSvg) {
      setError('Chart not rendered. Please try again.')
      return
    }

    let imageBlob: Blob
    try {
      imageBlob = await svgToBlob(chartSvg as unknown as SVGElement)
      setChartImageBlob(imageBlob)
    } catch (err) {
      console.error('Failed to capture chart:', err)
      setError('Failed to capture chart image. Please try again.')
      return
    }

    setIsEncrypting(true)
    setStep('encrypting')
    setError(null)

    try {
      // Initialize FHEVM
      console.log('Initializing FHEVM...')
      await initFhevm()
      console.log('FHEVM initialized successfully')

      // Encrypt birth data
      console.log('Encrypting birth data for:', {
        contractAddress: FHE_CONTRACT_ADDRESS,
        userAddress: address,
        birthData: {
          year: birthData.year,
          month: birthData.month,
          day: birthData.day,
          hour: birthData.hour,
          minute: birthData.minute,
          lat: birthData.latitude,
          long: birthData.longitude
        }
      })

      const encrypted = await encryptBirthData(
        birthData,
        FHE_CONTRACT_ADDRESS,
        address
      )

      console.log('Encryption successful, handles created')
      setEncryptedData(encrypted)
      setStep('uploading')

      // Proceed to upload with the captured image
      await handleUploadAndMint(encrypted, imageBlob)
    } catch (err: any) {
      console.error('=== ENCRYPTION ERROR ===')
      console.error('Error:', err)
      console.error('Error message:', err?.message)
      console.error('Error stack:', err?.stack)

      let errorMessage = 'Failed to encrypt birth data. '
      if (err?.message?.includes('network')) {
        errorMessage += 'Network error - please check your connection.'
      } else if (err?.message?.includes('SDK')) {
        errorMessage += 'FHEVM SDK initialization failed.'
      } else {
        errorMessage += err?.message || 'Please try again.'
      }

      setError(errorMessage)
      setStep('preview')
    } finally {
      setIsEncrypting(false)
    }
  }

  // Upload metadata and mint
  const handleUploadAndMint = async (encrypted: EncryptedBirthData, imageBlob: Blob) => {
    if (!address || !calculatedChart) return

    try {

      // Upload image to IPFS
      const imageUri = await uploadBlobToPinata(
        imageBlob,
        `cosmic-fhe-chart-${address.slice(0, 8)}.png`
      )

      // Create metadata (without sensitive birth data)
      const metadata = {
        name: `CosmicBase FHE Birth Chart${displayName ? ` - ${displayName}` : ''}`,
        description: `Privacy-preserving birth chart NFT. Sun: ${getSignName(calculatedChart.sunSign)}, Moon: ${getSignName(calculatedChart.moonSign)}, Rising: ${getSignName(calculatedChart.risingSign)}. Birth data is encrypted using FHE.`,
        image: imageUri,
        attributes: [
          { trait_type: 'Sun Sign', value: getSignName(calculatedChart.sunSign) },
          { trait_type: 'Moon Sign', value: getSignName(calculatedChart.moonSign) },
          { trait_type: 'Rising Sign', value: getSignName(calculatedChart.risingSign) },
          { trait_type: 'Privacy', value: 'FHE Encrypted' },
        ],
        properties: {
          encrypted: true,
          encryption_type: 'Zama FHEVM',
        },
      }

      // Upload metadata to IPFS
      const metadataUri = await uploadToPinata(metadata as any)
      setMetadataURI(metadataUri)

      // Proceed to minting
      setStep('minting')

      // Call mint function
      const formattedInputs = formatEncryptedInputsForContract(encrypted)

      // Debug: Log encrypted data and formatted inputs
      console.log('=== FHE MINT DEBUG INFO ===')
      console.log('Contract Address:', FHE_CONTRACT_ADDRESS)
      console.log('User Address:', address)
      console.log('Encrypted handles lengths:', {
        year: encrypted.encryptedYear.length,
        month: encrypted.encryptedMonth.length,
        day: encrypted.encryptedDay.length,
        hour: encrypted.encryptedHour.length,
        minute: encrypted.encryptedMinute.length,
        lat: encrypted.encryptedLatitude.length,
        long: encrypted.encryptedLongitude.length,
        proof: encrypted.inputProof.length
      })
      console.log('Formatted inputs (bytes32):', formattedInputs.slice(0, 7))
      console.log('Input proof length:', formattedInputs[7].length)
      console.log('Metadata URI:', metadataUri)
      console.log('Signs:', {
        sun: calculatedChart.sunSign,
        moon: calculatedChart.moonSign,
        rising: calculatedChart.risingSign
      })
      console.log('=== END DEBUG INFO ===')

      // Set manual gas limit for FHE operations
      // FHE operations (fromExternal, allow) are gas-intensive but 15M was too high
      // Using 3M which should be sufficient for this operation
      writeContract({
        address: FHE_CONTRACT_ADDRESS,
        abi: FHE_CONTRACT_ABI,
        functionName: 'mintBirthChart',
        args: [
          formattedInputs[0], // encryptedYear
          formattedInputs[1], // encryptedMonth
          formattedInputs[2], // encryptedDay
          formattedInputs[3], // encryptedHour
          formattedInputs[4], // encryptedMinute
          formattedInputs[5], // encryptedLatitude
          formattedInputs[6], // encryptedLongitude
          formattedInputs[7], // inputProof
          metadataUri,
          calculatedChart.sunSign,
          calculatedChart.moonSign,
          calculatedChart.risingSign,
        ],
        gas: BigInt(3000000), // Reduced gas limit - 3M should be sufficient
      })
    } catch (err) {
      console.error('Upload/Mint error:', err)
      setError('Failed to upload metadata or mint NFT. Please try again.')
      setStep('preview')
    }
  }

  // Handle mint success
  useEffect(() => {
    if (isSuccess && hash) {
      console.log('=== MINT SUCCESS ===')
      console.log('Transaction hash:', hash)
      console.log('Receipt:', receipt)

      // Get token ID from event logs
      onMintSuccess?.(BigInt(1)) // Simplified - actual implementation should parse logs
    }
  }, [isSuccess, hash, receipt, onMintSuccess])

  // Log transaction state changes for debugging
  useEffect(() => {
    if (hash) {
      console.log('Transaction submitted:', hash)
    }
  }, [hash])

  useEffect(() => {
    console.log('Transaction state:', { isConfirming, isSuccess, hash: hash?.slice(0, 10) })
  }, [isConfirming, isSuccess, hash])

  // Handle write error
  useEffect(() => {
    if (writeError) {
      console.error('=== WRITE CONTRACT ERROR ===')
      console.error('Error name:', writeError.name)
      console.error('Error message:', writeError.message)
      console.error('Full error:', writeError)

      // Parse error message for better user feedback
      let userMessage = 'Transaction failed. '
      const errorMsg = writeError.message.toLowerCase()

      if (errorMsg.includes('user rejected') || errorMsg.includes('user denied')) {
        userMessage = 'Transaction cancelled by user.'
      } else if (errorMsg.includes('insufficient funds')) {
        userMessage = 'Insufficient funds for gas. Please add more ETH to your wallet.'
      } else if (errorMsg.includes('already minted')) {
        userMessage = 'You have already minted a birth chart.'
      } else if (errorMsg.includes('execution reverted')) {
        // Extract revert reason if available
        const revertMatch = writeError.message.match(/reason="([^"]+)"/)
        if (revertMatch) {
          userMessage = `Transaction reverted: ${revertMatch[1]}`
        } else {
          userMessage = 'Transaction reverted. Check console for details.'
        }
      } else if (errorMsg.includes('gas')) {
        userMessage = 'Gas estimation failed. The transaction may fail on-chain.'
      } else {
        userMessage = `Error: ${writeError.message.slice(0, 200)}`
      }

      setError(userMessage)
      setStep('preview')
    }
  }, [writeError])

  // Prevent hydration mismatch by not rendering wallet-dependent content until mounted
  if (!mounted || !isConnected) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg text-center">
        <p className="text-gray-300">
          {!mounted ? 'Loading...' : 'Please connect your wallet to mint a privacy-preserving birth chart NFT.'}
        </p>
      </div>
    )
  }

  // Show existing NFT if user has already minted
  // Only show after mounted to prevent hydration mismatch
  if (hasAlreadyMinted && existingNFT && mounted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6">
          Your FHE-Encrypted Birth Chart
        </h2>

        {/* NFT Display */}
        <div className="space-y-6">
          {/* Chart Image */}
          {existingNFT.imageUrl && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <img
                src={existingNFT.imageUrl}
                alt="Your Birth Chart"
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Chart Summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Sun</p>
              <p className="text-lg font-semibold text-yellow-400">{getSignName(existingNFT.sunSign)}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Moon</p>
              <p className="text-lg font-semibold text-blue-400">{getSignName(existingNFT.moonSign)}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Rising</p>
              <p className="text-lg font-semibold text-green-400">{getSignName(existingNFT.risingSign)}</p>
            </div>
          </div>

          {/* Token Info */}
          <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="text-purple-300 font-semibold">Token ID:</span> #{existingNFT.tokenId.toString()}
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Your birth data is securely encrypted on-chain using FHE. Only you can decrypt and view your sensitive information.
            </p>
          </div>

          {/* View on OpenSea / Etherscan */}
          <div className="flex gap-4">
            <a
              href={`https://sepolia.etherscan.io/token/${FHE_CONTRACT_ADDRESS}?a=${existingNFT.tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg text-center"
            >
              View on Etherscan
            </a>
            <a
              href={existingNFT.metadataURI.replace('ipfs://', 'https://dweb.link/ipfs/')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-center"
            >
              View Metadata
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        Mint Your FHE-Encrypted Birth Chart
      </h2>

      {/* Privacy Notice */}
      <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg">
        <h3 className="text-purple-300 font-semibold mb-2">Privacy Protection</h3>
        <p className="text-sm text-gray-300">
          Your birth data will be encrypted using Fully Homomorphic Encryption (FHE)
          before being stored on-chain. Only you can decrypt and view your sensitive data.
        </p>
      </div>

      {error && !hasAlreadyMinted && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {step === 'input' && (
        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name or alias"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {/* Birth Date */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
              <input
                type="number"
                value={birthData.year}
                onChange={e => setBirthData(prev => ({ ...prev, year: parseInt(e.target.value) || 1990 }))}
                min={1900}
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Month</label>
              <input
                type="number"
                value={birthData.month}
                onChange={e => setBirthData(prev => ({ ...prev, month: parseInt(e.target.value) || 1 }))}
                min={1}
                max={12}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Day</label>
              <input
                type="number"
                value={birthData.day}
                onChange={e => setBirthData(prev => ({ ...prev, day: parseInt(e.target.value) || 1 }))}
                min={1}
                max={31}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Birth Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hour (0-23)</label>
              <input
                type="number"
                value={birthData.hour}
                onChange={e => setBirthData(prev => ({ ...prev, hour: parseInt(e.target.value) || 0 }))}
                min={0}
                max={23}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Minute</label>
              <input
                type="number"
                value={birthData.minute}
                onChange={e => setBirthData(prev => ({ ...prev, minute: parseInt(e.target.value) || 0 }))}
                min={0}
                max={59}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Location Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Birth Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationSearch}
                onChange={e => setLocationSearch(e.target.value)}
                placeholder="City name (e.g., New York, Tokyo)"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                onKeyDown={e => e.key === 'Enter' && searchLocation()}
              />
              <button
                onClick={searchLocation}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Search
              </button>
            </div>
            {locationFound && (
              <p className="mt-2 text-sm text-green-400">
                Location found: {birthData.latitude.toFixed(4)}, {birthData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <button
            onClick={() => setStep('preview')}
            disabled={!locationFound || isCalculating || !calculatedChart}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg"
          >
            {isCalculating ? 'Calculating...' : 'Preview Chart'}
          </button>
        </div>
      )}

      {step === 'preview' && calculatedChart && (
        <div className="space-y-6">
          {/* Chart Preview */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-center">
              <NatalChartSVG
                sunSign={getSignName(calculatedChart.sunSign)}
                moonSign={getSignName(calculatedChart.moonSign)}
                risingSign={getSignName(calculatedChart.risingSign)}
                customization={customization}
                planets={calculatedChart.fullChart?.celestialBodies}
                houses={calculatedChart.fullChart?.houses}
                aspects={calculatedChart.fullChart?.aspects}
              />
            </div>
          </div>

          {/* Chart Summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Sun</p>
              <p className="text-lg font-semibold text-yellow-400">{getSignName(calculatedChart.sunSign)}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Moon</p>
              <p className="text-lg font-semibold text-blue-400">{getSignName(calculatedChart.moonSign)}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Rising</p>
              <p className="text-lg font-semibold text-green-400">{getSignName(calculatedChart.risingSign)}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('input')}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleEncrypt}
              disabled={isEncrypting || isWriting || isConfirming || hasAlreadyMinted}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg"
            >
              {hasAlreadyMinted ? 'Already Minted' : 'Encrypt & Mint'}
            </button>
          </div>
        </div>
      )}

      {(step === 'encrypting' || step === 'uploading' || step === 'minting') && (
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white">
            {step === 'encrypting' && 'Encrypting your birth data with FHE...'}
            {step === 'uploading' && 'Uploading to IPFS...'}
            {step === 'minting' && 'Minting your NFT...'}
          </p>
          {isConfirming && (
            <p className="text-sm text-gray-400">Waiting for transaction confirmation...</p>
          )}
        </div>
      )}

      {isSuccess && (
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-bold text-white">Success!</h3>
          <p className="text-gray-300">
            Your FHE-encrypted birth chart NFT has been minted successfully!
          </p>
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-purple-400 hover:text-purple-300 underline"
          >
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  )
}

export default MintFormFHE
