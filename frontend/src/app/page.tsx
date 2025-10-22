'use client'

import { WalletConnect } from '@/components/WalletConnect'
import { MintForm } from '@/components/MintForm'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic">
            CosmicBase
          </h1>
          <WalletConnect />
        </div>

        {!isConnected ? (
          <>
            <p className="text-xl text-center mb-12 text-gray-300">
              Mint your birth chart as an NFT on Base blockchain
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
              <div className="bg-white/5 p-6 rounded-lg border border-purple-500/20">
                <div className="text-3xl mb-4">🌙</div>
                <h3 className="text-lg font-semibold mb-2">Birth Chart NFT</h3>
                <p className="text-gray-400 text-sm">
                  Mint your unique astrological profile as a permanent NFT
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border border-purple-500/20">
                <div className="text-3xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold mb-2">Compatibility</h3>
                <p className="text-gray-400 text-sm">
                  Check cosmic compatibility with other wallets
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border border-purple-500/20">
                <div className="text-3xl mb-4">🔮</div>
                <h3 className="text-lg font-semibold mb-2">Daily Insights</h3>
                <p className="text-gray-400 text-sm">
                  Get personalized horoscope based on your chart
                </p>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              Built on Base Sepolia Testnet
            </p>
          </>
        ) : (
          <div className="w-full">
            <MintForm />
          </div>
        )}
      </div>
    </main>
  )
}
