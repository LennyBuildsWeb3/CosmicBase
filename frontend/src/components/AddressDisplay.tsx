'use client'

import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { getBasename, formatAddressOrBasename, getBasenameUrl } from '@/lib/basename'
import { useChainId } from 'wagmi'

interface AddressDisplayProps {
  address: Address
  showFullAddress?: boolean
  linkToBaseScan?: boolean
  className?: string
}

/**
 * Component to display an address with Basename support
 * Automatically resolves and displays the Basename if available
 */
export function AddressDisplay({
  address,
  showFullAddress = false,
  linkToBaseScan = false,
  className = ''
}: AddressDisplayProps) {
  const [basename, setBasename] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const chainId = useChainId()

  useEffect(() => {
    let mounted = true

    async function fetchBasename() {
      setIsLoading(true)
      try {
        const name = await getBasename(address, chainId)
        if (mounted) {
          setBasename(name)
        }
      } catch (error) {
        console.error('Error fetching basename:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchBasename()

    return () => {
      mounted = false
    }
  }, [address, chainId])

  const displayText = showFullAddress
    ? address
    : formatAddressOrBasename(address, basename)

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {isLoading && !basename ? (
        <span className="text-gray-400">Loading...</span>
      ) : (
        <>
          {basename && (
            <span className="text-purple-400 font-semibold" title={address}>
              {basename}
            </span>
          )}
          {!basename && (
            <span className="font-mono text-gray-300" title={address}>
              {displayText}
            </span>
          )}
        </>
      )}
    </span>
  )

  if (linkToBaseScan) {
    const baseScanUrl = (chainId && chainId === 8453)
      ? `https://basescan.org/address/${address}`
      : `https://sepolia.basescan.org/address/${address}`

    return (
      <a
        href={baseScanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-purple-300 transition-colors inline-flex items-center gap-1"
      >
        {content}
        <svg
          className="w-3 h-3 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    )
  }

  return content
}
