'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect } from 'react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const connector = connectors.find(c => c.type === 'injected')
      if (connector && !isConnected) {
        try {
          await connect({ connector })
        } catch (error) {
          // Silent fail on auto-connect
          console.log('Auto-connect failed:', error)
        }
      }
    }
    autoConnect()
  }, []) // Only run once on mount

  const handleConnect = async () => {
    // Try injected (MetaMask) first
    const injectedConnector = connectors.find(c => c.type === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    } else {
      // Fallback to WalletConnect
      const wcConnector = connectors.find(c => c.type === 'walletConnect')
      if (wcConnector) {
        connect({ connector: wcConnector })
      }
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-white/5 px-4 py-2 rounded-lg border border-purple-500/20">
          <span className="text-sm text-gray-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
