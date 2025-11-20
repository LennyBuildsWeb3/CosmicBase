'use client'

import { useState } from 'react'
import { useAccount, useReadContract, usePublicClient, useWalletClient } from 'wagmi'
import { type Address } from 'viem'
import { FHE_CONTRACT_ADDRESS, FHE_CONTRACT_ABI } from '@/config/contract-fhe'
import { requestDecryption, decodeCoordinates, initFhevm } from '@/lib/fhe'
import { getSignName } from '@/lib/astrology'

interface BirthDataViewerProps {
  tokenId: bigint
}

interface DecryptedBirthData {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  latitude: number
  longitude: number
}

export function BirthDataViewer({ tokenId }: BirthDataViewerProps) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [isDecrypting, setIsDecrypting] = useState(false)
  const [decryptedData, setDecryptedData] = useState<DecryptedBirthData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch public chart data
  const { data: chartData, isLoading } = useReadContract({
    address: FHE_CONTRACT_ADDRESS,
    abi: FHE_CONTRACT_ABI,
    functionName: 'getBirthChart',
    args: [tokenId],
  })

  // Fetch token owner
  const { data: tokenOwner } = useReadContract({
    address: FHE_CONTRACT_ADDRESS,
    abi: FHE_CONTRACT_ABI,
    functionName: 'ownerOf',
    args: [tokenId],
  })

  const isOwner = (tokenOwner as string)?.toLowerCase() === address?.toLowerCase()

  const handleDecrypt = async () => {
    if (!address || !publicClient || !walletClient) {
      setError('Wallet not connected')
      return
    }

    if (!isOwner) {
      setError('Only the token owner can decrypt birth data')
      return
    }

    setIsDecrypting(true)
    setError(null)

    try {
      // Initialize FHEVM
      await initFhevm()

      // Note: In a real implementation, you would:
      // 1. Call the contract to get encrypted handles
      // 2. Use the relayer SDK for self-relaying decryption
      // 3. Or request on-chain decryption via the Gateway

      // For demonstration, we'll show the decryption UI flow
      // The actual implementation depends on how you want to handle decryption

      // This is a placeholder for the actual decryption logic
      // Real implementation would use:
      // const encryptedYear = await contract.getEncryptedBirthYear(tokenId)
      // const decrypted = await requestDecryption(FHE_CONTRACT_ADDRESS, encryptedYear, publicClient, walletClient)

      setError('Decryption feature requires FHEVM relayer SDK integration. See documentation for setup.')

    } catch (err) {
      console.error('Decryption error:', err)
      setError(err instanceof Error ? err.message : 'Failed to decrypt data')
    } finally {
      setIsDecrypting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-red-400">Birth chart not found</p>
      </div>
    )
  }

  const chart = chartData as {
    metadataURI: string
    mintTimestamp: bigint
    sunSign: number
    moonSign: number
    risingSign: number
    hasEncryptedData: boolean
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg space-y-6">
      <h3 className="text-xl font-bold text-white">Birth Chart #{tokenId.toString()}</h3>

      {/* Public Data */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-xs text-gray-400 mb-1">Sun Sign</p>
          <p className="text-lg font-semibold text-yellow-400">{getSignName(chart.sunSign)}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-xs text-gray-400 mb-1">Moon Sign</p>
          <p className="text-lg font-semibold text-blue-400">{getSignName(chart.moonSign)}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-xs text-gray-400 mb-1">Rising Sign</p>
          <p className="text-lg font-semibold text-green-400">{getSignName(chart.risingSign)}</p>
        </div>
      </div>

      {/* Encrypted Data Section */}
      {chart.hasEncryptedData && (
        <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-900/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-purple-300 font-semibold">Encrypted Birth Data</h4>
              <p className="text-sm text-gray-400">
                Your exact birth date, time, and location are encrypted on-chain
              </p>
            </div>
            <div className="text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {isOwner ? (
            <>
              {decryptedData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-gray-800 rounded">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white ml-2">
                        {decryptedData.month}/{decryptedData.day}/{decryptedData.year}
                      </span>
                    </div>
                    <div className="p-2 bg-gray-800 rounded">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white ml-2">
                        {String(decryptedData.hour).padStart(2, '0')}:{String(decryptedData.minute).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="p-2 bg-gray-800 rounded col-span-2">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white ml-2">
                        {decryptedData.latitude.toFixed(4)}, {decryptedData.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition"
                >
                  {isDecrypting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Decrypting...
                    </span>
                  ) : (
                    'Decrypt Birth Data'
                  )}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">
              Only the token owner can decrypt this data
            </p>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="text-sm text-gray-400">
        <p>Minted: {new Date(Number(chart.mintTimestamp) * 1000).toLocaleDateString()}</p>
        {chart.metadataURI && (
          <a
            href={chart.metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            View Metadata
          </a>
        )}
      </div>
    </div>
  )
}

export default BirthDataViewer
