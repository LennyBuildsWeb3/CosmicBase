'use client'

import { WalletConnect } from '@/components/WalletConnect'
import { MintForm } from '@/components/MintForm'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="relative flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="z-10 max-w-6xl w-full items-center justify-center flex flex-col">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-cosmic mb-2">
              CosmicBase
            </h1>
            <p className="text-purple-300/70 text-sm md:text-base">
              Your cosmic identity on the blockchain
            </p>
          </div>
          <WalletConnect />
        </div>

        {!isConnected ? (
          <>
            <div className="text-center mb-16 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Mint Your Birth Chart as an NFT
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Transform your astrological profile into a permanent digital asset on Base blockchain.
                Discover your cosmic identity and connect with the universe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
              <div className="card-cosmic p-8 rounded-2xl group cursor-pointer">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🌙</div>
                <h3 className="text-xl font-bold mb-3 text-purple-200">Birth Chart NFT</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Mint your unique astrological profile as a permanent NFT with your Sun, Moon, and Rising signs
                </p>
              </div>

              <div className="card-cosmic p-8 rounded-2xl group cursor-pointer">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">⭐</div>
                <h3 className="text-xl font-bold mb-3 text-purple-200">Compatibility</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Check cosmic compatibility with other wallets and discover your astrological connections
                </p>
              </div>

              <div className="card-cosmic p-8 rounded-2xl group cursor-pointer">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🔮</div>
                <h3 className="text-xl font-bold mb-3 text-purple-200">Daily Insights</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Get personalized horoscope and cosmic guidance based on your unique birth chart
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Built on Base Sepolia Testnet</span>
              </div>
              <p className="text-gray-500 text-xs">
                Connect your wallet to start your cosmic journey
              </p>
            </div>
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
