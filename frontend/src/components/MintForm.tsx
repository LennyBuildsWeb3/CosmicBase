'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI, ZODIAC_SIGNS } from '@/config/contract'
import { BirthData, calculateBirthChart, validateBirthData, getSignName, getSignEmoji } from '@/lib/astrology'
import { uploadToPinata, generateChartImageUrl, BirthChartMetadata } from '@/lib/pinata'

export function MintForm() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Update step when transaction is successful
  useEffect(() => {
    if (isSuccess) {
      setStep('success')
    }
  }, [isSuccess])

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

      // Step 2: Upload to IPFS
      setStep('uploading')
      const metadata: BirthChartMetadata = {
        name: `CosmicBase Birth Chart #${address.slice(0, 6)}`,
        description: `Birth chart for ${getSignName(chart.sunSign)} Sun, ${getSignName(chart.moonSign)} Moon, ${getSignName(chart.risingSign)} Rising`,
        image: generateChartImageUrl(
          getSignName(chart.sunSign),
          getSignName(chart.moonSign),
          getSignName(chart.risingSign)
        ),
        attributes: [
          { trait_type: 'Sun Sign', value: getSignName(chart.sunSign) },
          { trait_type: 'Moon Sign', value: getSignName(chart.moonSign) },
          { trait_type: 'Rising Sign', value: getSignName(chart.risingSign) },
          { trait_type: 'Birth Year', value: formData.year }
        ],
        birthChart: chart.fullChart
      }

      const ipfsUri = await uploadToPinata(metadata)

      // Step 3: Mint NFT
      setStep('minting')
      await writeContract({
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

    } catch (err: any) {
      console.error('Mint error:', err)
      setFormError(err.message || 'Failed to mint birth chart')
      setStep('form')
    }
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
          <button
            onClick={() => {
              setStep('form')
              setCalculatedChart(null)
            }}
            className="glow-button px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            View Profile
          </button>
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
                onChange={e => setFormData({ ...formData, day: parseInt(e.target.value) })}
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
                onChange={e => setFormData({ ...formData, month: parseInt(e.target.value) })}
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
                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
                onChange={e => setFormData({ ...formData, hour: parseInt(e.target.value) })}
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
                onChange={e => setFormData({ ...formData, minute: parseInt(e.target.value) })}
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
