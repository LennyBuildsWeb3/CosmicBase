'use client'

import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { FHE_CONTRACT_ADDRESS, FHE_CONTRACT_ABI } from '@/config/contract-fhe'

export function StatsDisplay() {
  const [totalMints, setTotalMints] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchStats() {
      if (!publicClient) return

      try {
        const total = await publicClient.readContract({
          address: FHE_CONTRACT_ADDRESS,
          abi: FHE_CONTRACT_ABI,
          functionName: 'totalSupply',
        })

        setTotalMints(Number(total))
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [publicClient])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-400 text-sm">Loading stats...</span>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-800/50 border border-purple-500/30 rounded-xl">
      <div className="text-center">
        <div className="text-4xl font-bold text-purple-300 mb-2">
          {totalMints ?? 0}
        </div>
        <div className="text-sm text-gray-400 mb-3">
          Birth Charts Minted
        </div>
        <div className="text-xs text-gray-500">
          Powered by FHE encrypted statistics
        </div>
      </div>
    </div>
  )
}
