'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI, ZODIAC_SIGNS } from '@/config/contract'
import { BirthData, calculateBirthChart, validateBirthData, getSignName, getSignEmoji } from '@/lib/astrology'
import { uploadToPinata, uploadBlobToPinata, getIPFSUrl, BirthChartMetadata } from '@/lib/pinata'
import { ChartCustomization } from '@/types/customization'
import { CustomizationPanel } from './chart/CustomizationPanel'
import { NatalChartSVG } from './chart/NatalChartSVG'
import { svgToBlob } from '@/lib/chartImage'
import { AddressDisplay } from './AddressDisplay'

export function MintForm() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const [hasAlreadyMinted, setHasAlreadyMinted] = useState<boolean | null>(null)
  const [isCheckingMint, setIsCheckingMint] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [nftData, setNftData] = useState<any>(null)

  // Wait for client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Debug logging
  useEffect(() => {
    console.log('MintForm state:', { isPending, isConfirming, isSuccess, hash, error: error?.message })
  }, [isPending, isConfirming, isSuccess, hash, error])

  // Check if user has already minted (client-side only)
  useEffect(() => {
    const checkIfMinted = async () => {
      if (!isMounted || !address || !isConnected) {
        setIsCheckingMint(false)
        return
      }

      try {
        // We'll check this by calling the contract
        const { createPublicClient, http } = await import('viem')
        const { baseSepolia } = await import('viem/chains')

        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http()
        })

        const hasMinted = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'hasUserMinted',
          args: [address]
        }) as boolean

        setHasAlreadyMinted(hasMinted)

        if (hasMinted) {
          console.log('User has already minted a birth chart')

          // Fetch NFT data
          try {
            const tokenId = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'getTokenByAddress',
              args: [address]
            }) as bigint

            const birthChart = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'getBirthChart',
              args: [tokenId]
            }) as any

            console.log('Birth chart data:', birthChart)

            // Fetch metadata from IPFS
            if (birthChart.metadataURI) {
              const metadataResponse = await fetch(birthChart.metadataURI.replace('ipfs://', 'https://ipfs.io/ipfs/'))
              const metadata = await metadataResponse.json()

              setNftData({
                tokenId: tokenId.toString(),
                sunSign: birthChart.sunSign,
                moonSign: birthChart.moonSign,
                risingSign: birthChart.risingSign,
                metadata
              })
            }
          } catch (err) {
            console.error('Error fetching NFT data:', err)
          }
        }
      } catch (err) {
        console.error('Error checking if user minted:', err)
        setHasAlreadyMinted(false)
      } finally {
        setIsCheckingMint(false)
      }
    }

    checkIfMinted()
  }, [address, isConnected, isMounted])

  const [step, setStep] = useState<'form' | 'calculating' | 'uploading' | 'minting' | 'success'>('form')
  const [formData, setFormData] = useState<BirthData>({
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    latitude: 0,
    longitude: 0
  })
  const [cityName, setCityName] = useState<string>('')
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)
  const [locationFound, setLocationFound] = useState(false)
  const [calculatedChart, setCalculatedChart] = useState<any>(null)
  const [formError, setFormError] = useState<string>('')
  const [customization, setCustomization] = useState<ChartCustomization>({
    displayName: '',
    colorTheme: 'cosmic-purple',
    chartStyle: 'modern',
    zodiacArtStyle: 'detailed'
  })
  const [showCustomization, setShowCustomization] = useState(false)
  const chartSvgRef = useRef<SVGSVGElement>(null)

  // Update step when transaction is successful
  useEffect(() => {
    if (isSuccess) {
      setStep('success')
    }
  }, [isSuccess])

  // Auto-calculate chart when birth data is complete
  useEffect(() => {
    if (locationFound && formData.year && formData.month && formData.day) {
      const validationError = validateBirthData(formData)
      if (!validationError) {
        try {
          const chart = calculateBirthChart(formData)
          setCalculatedChart(chart)
          setFormError('')
        } catch (err) {
          console.error('Chart calculation error:', err)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.year, formData.month, formData.day, formData.hour, formData.minute, formData.latitude, formData.longitude, locationFound])

  // Geocode city name to coordinates
  const handleCitySearch = async () => {
    if (!cityName.trim()) {
      setFormError('Please enter a city name')
      return
    }

    setIsGeocodingLoading(true)
    setFormError('')

    try {
      // Using Nominatim (OpenStreetMap) API - free and no API key required
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        setFormData({
          ...formData,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        })
        setLocationFound(true)
        setFormError('')
        console.log(`Location found: ${display_name} (${lat}, ${lon})`)
      } else {
        setFormError('Location not found. Please try with city and country (e.g., "Paris, France")')
        setLocationFound(false)
      }
    } catch (err) {
      console.error('Geocoding error:', err)
      setFormError('Failed to find location. Please try again.')
      setLocationFound(false)
    } finally {
      setIsGeocodingLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!isConnected || !address) {
      setFormError('Please connect your wallet first')
      return
    }

    // Check if user already minted
    if (hasAlreadyMinted) {
      setFormError('You have already minted your birth chart! Each wallet can only mint once.')
      return
    }

    // Check if location was found
    if (!locationFound || formData.latitude === 0 || formData.longitude === 0) {
      setFormError('Please search and select your birth location first')
      return
    }

    // Validate birth data
    const validationError = validateBirthData(formData)
    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      // Step 1: Calculate birth chart
      setStep('calculating')
      const chart = calculateBirthChart(formData)
      setCalculatedChart(chart)

      // Step 2: Generate and upload chart image
      setStep('uploading')

      // Wait a bit to ensure SVG is rendered
      await new Promise(resolve => setTimeout(resolve, 500))

      let imageUri = ''
      if (chartSvgRef.current) {
        try {
          // Convert SVG to PNG blob
          const blob = await svgToBlob(chartSvgRef.current)

          // Upload image to IPFS
          imageUri = await uploadBlobToPinata(
            blob,
            `cosmicbase-chart-${address.slice(0, 6)}.png`
          )
          console.log('Chart image uploaded to IPFS:', imageUri)
        } catch (imgError) {
          console.error('Failed to generate/upload chart image:', imgError)
          // Continue with placeholder if image generation fails
        }
      }

      // Step 3: Upload metadata to IPFS
      const displayName = customization.displayName || address.slice(0, 8)
      const metadata: BirthChartMetadata = {
        name: `CosmicBase Birth Chart - ${displayName}`,
        description: `Birth chart for ${getSignName(chart.sunSign)} Sun, ${getSignName(chart.moonSign)} Moon, ${getSignName(chart.risingSign)} Rising`,
        image: imageUri ? getIPFSUrl(imageUri) : `https://api.dicebear.com/7.x/shapes/svg?seed=${chart.sunSign}-${chart.moonSign}-${chart.risingSign}`,
        attributes: [
          { trait_type: 'Sun Sign', value: getSignName(chart.sunSign) },
          { trait_type: 'Moon Sign', value: getSignName(chart.moonSign) },
          { trait_type: 'Rising Sign', value: getSignName(chart.risingSign) },
          // Privacy: Birth year removed to protect user privacy
          { trait_type: 'Color Theme', value: customization.colorTheme },
          { trait_type: 'Chart Style', value: customization.chartStyle }
        ],
        // Privacy: Full birth chart data is NOT stored on IPFS
        // Only the visualization (image) is stored publicly
        // This protects exact birth date, time, and location
        customization: {
          displayName: customization.displayName,
          colorTheme: customization.colorTheme,
          chartStyle: customization.chartStyle,
          zodiacArtStyle: customization.zodiacArtStyle
        }
      }

      const ipfsUri = await uploadToPinata(metadata)

      // Step 3: Mint NFT
      setStep('minting')
      console.log('Calling writeContract with:', {
        address: CONTRACT_ADDRESS,
        birthDataHash: chart.birthDataHash,
        ipfsUri,
        sunSign: chart.sunSign,
        moonSign: chart.moonSign,
        risingSign: chart.risingSign
      })

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintBirthChart',
        args: [
          chart.birthDataHash,
          ipfsUri,
          chart.sunSign,
          chart.moonSign,
          chart.risingSign
        ]
      })

      console.log('Transaction submitted - waiting for confirmation...')

    } catch (err: any) {
      console.error('Mint error:', err)

      // Always reset to form step first
      setStep('form')

      // Handle user rejection more gracefully
      const errorMessage = err.message || err.toString() || ''

      if (errorMessage.toLowerCase().includes('user rejected') ||
          errorMessage.toLowerCase().includes('user denied') ||
          errorMessage.toLowerCase().includes('user cancelled')) {
        setFormError('Transaction cancelled')
      } else if (errorMessage.toLowerCase().includes('insufficient funds')) {
        setFormError('Insufficient funds')
      } else {
        setFormError('Transaction failed. Please try again.')
      }
    }
  }

  // Show loading state during SSR or while checking
  if (!isMounted) {
    return (
      <div className="max-w-2xl mx-auto p-8 card-cosmic rounded-2xl">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">🔮</div>
          <h2 className="text-2xl font-bold mb-4 text-purple-300">
            Loading...
          </h2>
        </div>
      </div>
    )
  }

  if (isCheckingMint) {
    return (
      <div className="max-w-2xl mx-auto p-8 card-cosmic rounded-2xl">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">🔮</div>
          <h2 className="text-2xl font-bold mb-4 text-purple-300">
            Checking your cosmic profile...
          </h2>
        </div>
      </div>
    )
  }

  // Show already minted message with NFT details
  if (hasAlreadyMinted === true && isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-8 card-cosmic rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Your Cosmic Profile
          </h2>
          <div className="flex flex-col items-center gap-2">
            {address && (
              <div className="text-sm">
                <AddressDisplay address={address} linkToBaseScan={true} />
              </div>
            )}
            <p className="text-gray-400 text-sm">
              NFT #{nftData?.tokenId || '...'}
            </p>
          </div>
        </div>

        {nftData ? (
          <div className="space-y-6">
            {/* Chart Image */}
            {nftData.metadata?.image && (
              <div className="flex justify-center mb-6">
                <img
                  src={nftData.metadata.image}
                  alt="Birth Chart"
                  className="rounded-xl border-2 border-purple-500/30 max-w-md w-full"
                />
              </div>
            )}

            {/* Zodiac Signs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white/5 rounded-xl border border-purple-500/20">
                <div className="text-center">
                  <span className="text-5xl mb-2 block">{getSignEmoji(nftData.sunSign)}</span>
                  <p className="text-purple-300 text-sm mb-1">Sun Sign</p>
                  <p className="text-xl font-semibold">{getSignName(nftData.sunSign)}</p>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-purple-500/20">
                <div className="text-center">
                  <span className="text-5xl mb-2 block">{getSignEmoji(nftData.moonSign)}</span>
                  <p className="text-purple-300 text-sm mb-1">Moon Sign</p>
                  <p className="text-xl font-semibold">{getSignName(nftData.moonSign)}</p>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-xl border border-purple-500/20">
                <div className="text-center">
                  <span className="text-5xl mb-2 block">{getSignEmoji(nftData.risingSign)}</span>
                  <p className="text-purple-300 text-sm mb-1">Rising Sign</p>
                  <p className="text-xl font-semibold">{getSignName(nftData.risingSign)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {nftData.metadata?.description && (
              <div className="p-6 bg-white/5 rounded-xl border border-purple-500/20">
                <p className="text-gray-300 text-center">{nftData.metadata.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href={`https://sepolia.basescan.org/token/${CONTRACT_ADDRESS}?a=${nftData.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block glow-button px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                View on BaseScan
              </a>
              {nftData.metadata?.image && (
                <a
                  href={nftData.metadata.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-white/10 border border-purple-500/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  View Full Image
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">🔮</div>
            <p className="text-gray-300 mb-8">Loading your cosmic profile...</p>
            <a
              href={`https://sepolia.basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block glow-button px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              View Your NFTs on BaseScan
            </a>
          </div>
        )}
      </div>
    )
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 card-cosmic rounded-2xl">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">✨</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Birth Chart Minted!
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Your cosmic profile has been immortalized on the blockchain
          </p>
          {calculatedChart && (
            <div className="space-y-4 mb-8 p-6 bg-white/5 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-center gap-3 text-xl">
                <span className="text-3xl">{getSignEmoji(calculatedChart.sunSign)}</span>
                <span className="text-purple-300">Sun:</span>
                <span className="font-semibold">{getSignName(calculatedChart.sunSign)}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xl">
                <span className="text-3xl">{getSignEmoji(calculatedChart.moonSign)}</span>
                <span className="text-purple-300">Moon:</span>
                <span className="font-semibold">{getSignName(calculatedChart.moonSign)}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xl">
                <span className="text-3xl">{getSignEmoji(calculatedChart.risingSign)}</span>
                <span className="text-purple-300">Rising:</span>
                <span className="font-semibold">{getSignName(calculatedChart.risingSign)}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block glow-button px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              View Transaction
            </a>
            <a
              href={`https://sepolia.basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white/10 border border-purple-500/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
            >
              View Your NFTs
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 card-cosmic rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
          Mint Your Birth Chart
        </h2>
        <p className="text-gray-400 text-sm">
          Enter your birth details to create your cosmic NFT
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                placeholder="Day"
                min="1"
                max="31"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Day</p>
            </div>
            <div>
              <input
                type="number"
                placeholder="Month"
                min="1"
                max="12"
                value={formData.month}
                onChange={e => setFormData({ ...formData, month: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Month</p>
            </div>
            <div>
              <input
                type="number"
                placeholder="Year"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 1990 })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Year</p>
            </div>
          </div>
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-sm font-medium mb-2">Time of Birth</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="Hour (0-23)"
                min="0"
                max="23"
                value={formData.hour}
                onChange={e => setFormData({ ...formData, hour: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Hour (24-hour format)</p>
            </div>
            <div>
              <input
                type="number"
                placeholder="Minute (0-59)"
                min="0"
                max="59"
                value={formData.minute}
                onChange={e => setFormData({ ...formData, minute: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Minute</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Place of Birth</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter city name (e.g., New York, USA)"
              value={cityName}
              onChange={e => setCityName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleCitySearch())}
              className="flex-1 px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCitySearch}
              disabled={isGeocodingLoading || !cityName.trim()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeocodingLoading ? 'Searching...' : 'Find'}
            </button>
          </div>
          {locationFound && (
            <div className="mt-2 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
              ✓ Location found: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Enter your birth city and country for accurate coordinates
          </p>
        </div>

        {/* Chart Preview - Always show when calculated */}
        {calculatedChart && (
          <div className="p-6 bg-white/5 rounded-xl border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-4 text-center text-purple-200">
              Your Birth Chart Preview
            </h3>
            <div className="flex justify-center items-center overflow-hidden">
              <div style={{ width: '400px', height: '400px', maxWidth: '100%' }}>
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
          </div>
        )}

        {/* Customization Section */}
        <div className="border-t border-purple-500/20 pt-6">
          <CustomizationPanel
            customization={customization}
            onChange={setCustomization}
          />
        </div>

        {/* Hidden SVG for image generation */}
        {calculatedChart && (
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <NatalChartSVG
              ref={chartSvgRef}
              sunSign={getSignName(calculatedChart.sunSign)}
              moonSign={getSignName(calculatedChart.moonSign)}
              risingSign={getSignName(calculatedChart.risingSign)}
              customization={customization}
              planets={calculatedChart.fullChart?.celestialBodies}
              houses={calculatedChart.fullChart?.houses}
              aspects={calculatedChart.fullChart?.aspects}
            />
          </div>
        )}

        {/* Error Display */}
        {formError && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {formError}
          </div>
        )}

        {/* Contract Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isConnected || isPending || isConfirming || step !== 'form'}
          className="glow-button w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {!isConnected && '🔒 Connect Wallet First'}
          {isConnected && step === 'form' && '✨ Mint Birth Chart NFT'}
          {step === 'calculating' && '🔮 Calculating Chart...'}
          {step === 'uploading' && '📤 Uploading to IPFS...'}
          {step === 'minting' && '⚡ Minting NFT...'}
          {isConfirming && '⏳ Confirming Transaction...'}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Your birth data is hashed and stored privately. Only zodiac signs are public.
      </p>
    </div>
  )
}
