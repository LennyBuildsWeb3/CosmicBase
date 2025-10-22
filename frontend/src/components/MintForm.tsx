'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI, ZODIAC_SIGNS } from '@/config/contract'
import { BirthData, calculateBirthChart, validateBirthData, getSignName, getSignEmoji } from '@/lib/astrology'
import { uploadToPinata, generateChartImageUrl, BirthChartMetadata } from '@/lib/pinata'

export function MintForm() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

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
  const [calculatedChart, setCalculatedChart] = useState<any>(null)
  const [formError, setFormError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!isConnected || !address) {
      setFormError('Please connect your wallet first')
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
      <div className="max-w-2xl mx-auto p-8 bg-white/5 rounded-xl border border-purple-500/20">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Birth Chart Minted!</h2>
          <p className="text-gray-300 mb-6">
            Your cosmic profile has been immortalized on the blockchain
          </p>
          {calculatedChart && (
            <div className="space-y-2 text-lg">
              <p>{getSignEmoji(calculatedChart.sunSign)} Sun: {getSignName(calculatedChart.sunSign)}</p>
              <p>{getSignEmoji(calculatedChart.moonSign)} Moon: {getSignName(calculatedChart.moonSign)}</p>
              <p>{getSignEmoji(calculatedChart.risingSign)} Rising: {getSignName(calculatedChart.risingSign)}</p>
            </div>
          )}
          <button
            onClick={() => {
              setStep('form')
              setCalculatedChart(null)
            }}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            View Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/5 rounded-xl border border-purple-500/20">
      <h2 className="text-3xl font-bold mb-6">Mint Your Birth Chart</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-2">Date of Birth</label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Year"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Month"
              min="1"
              max="12"
              value={formData.month}
              onChange={e => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Day"
              min="1"
              max="31"
              value={formData.day}
              onChange={e => setFormData({ ...formData, day: parseInt(e.target.value) })}
              className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-sm font-medium mb-2">Time of Birth</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Hour (0-23)"
              min="0"
              max="23"
              value={formData.hour}
              onChange={e => setFormData({ ...formData, hour: parseInt(e.target.value) })}
              className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Minute (0-59)"
              min="0"
              max="59"
              value={formData.minute}
              onChange={e => setFormData({ ...formData, minute: parseInt(e.target.value) })}
              className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Place of Birth</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
              className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
              className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            You can find coordinates at <a href="https://www.latlong.net/" target="_blank" className="text-purple-400 hover:underline">latlong.net</a>
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
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isConnected && 'Connect Wallet First'}
          {isConnected && step === 'form' && 'Mint Birth Chart NFT'}
          {step === 'calculating' && 'Calculating Chart...'}
          {step === 'uploading' && 'Uploading to IPFS...'}
          {step === 'minting' && 'Minting NFT...'}
          {isConfirming && 'Confirming Transaction...'}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Your birth data is hashed and stored privately. Only zodiac signs are public.
      </p>
    </div>
  )
}
