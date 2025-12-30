import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadProfile } from '../lib/storage'
import type { CosmicProfile } from '../lib/cosmic/profile'
import { FourPillarsCard } from '../components/FourPillarsCard'
import { ZodiacCard } from '../components/ZodiacCard'
import { CosmicProfileCard } from '../components/CosmicProfileCard'
import { WalletButton } from '../components/WalletButton'
import { NFT_CONTRACT_ADDRESS, getExplorerTxUrl } from '../lib/nft'
import { getSigner } from '../lib/wallet'
import { generateShareText, shareToTwitter, shareToTelegram, copyToClipboard } from '../lib/share'
import { Contract, BrowserProvider } from 'ethers'

const NFT_ABI = [
  'function mint(address to, string memory tokenURI) public returns (uint256)'
]

export function Result() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<CosmicProfile | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<'metamask' | 'wepin' | null>(null)
  const [wepinProvider, setWepinProvider] = useState<BrowserProvider | null>(null)
  const [minting, setMinting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const p = loadProfile()
    if (!p) navigate('/calculate')
    else setProfile(p)
  }, [navigate])

  const handleWalletConnect = (address: string, type: 'metamask' | 'wepin', provider?: BrowserProvider) => {
    setWalletAddress(address)
    setWalletType(type)
    if (provider) setWepinProvider(provider)
  }

  const handleMint = async () => {
    if (!walletAddress || !profile) return
    setMinting(true)
    try {
      const metadata = JSON.stringify({
        name: profile.cosmicTitle,
        description: profile.description,
        attributes: [
          { trait_type: 'Element', value: profile.saju.dominantElement },
          { trait_type: 'Zodiac', value: profile.zodiac.name }
        ]
      })
      const uri = `data:application/json;base64,${btoa(metadata)}`
      
      let signer
      if (walletType === 'wepin' && wepinProvider) {
        signer = await wepinProvider.getSigner()
      } else {
        signer = await getSigner()
      }
      
      const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer)
      const tx = await contract.mint(walletAddress, uri)
      const receipt = await tx.wait()
      setTxHash(receipt.hash)
    } catch (e) {
      console.error(e)
      alert('Mint failed: ' + (e as Error).message)
    }
    setMinting(false)
  }

  const handleShare = async (platform: 'twitter' | 'telegram' | 'copy') => {
    if (!profile) return
    const text = generateShareText({
      cosmicTitle: profile.cosmicTitle,
      description: profile.description,
      element: profile.saju.dominantElement,
      zodiac: profile.zodiac.name
    })
    const url = window.location.origin
    
    if (platform === 'twitter') shareToTwitter(text, url)
    else if (platform === 'telegram') shareToTelegram(text, url)
    else {
      const ok = await copyToClipboard(text + '\n' + url)
      if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
    }
  }

  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <CosmicProfileCard profile={profile} />
      
      <div className="grid md:grid-cols-2 gap-6">
        <FourPillarsCard saju={profile.saju} />
        <ZodiacCard zodiac={profile.zodiac} />
      </div>

      {/* Share Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur text-center">
        <h3 className="text-xl font-bold mb-4 text-white">Share Your Profile ✨</h3>
        <div className="flex justify-center gap-3">
          <button onClick={() => handleShare('twitter')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition">
            𝕏 Twitter
          </button>
          <button onClick={() => handleShare('telegram')}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition">
            ✈️ Telegram
          </button>
          <button onClick={() => handleShare('copy')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Mint Section */}
      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur text-center">
        <h3 className="text-xl font-bold mb-4 text-white">Mint as NFT</h3>
        <p className="text-gray-400 mb-4">Save your cosmic profile on Very Chain</p>
        <div className="flex justify-center gap-4">
          <WalletButton onConnect={handleWalletConnect} />
          {walletAddress && !txHash && (
            <button 
              onClick={handleMint}
              disabled={minting}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 rounded-lg font-medium transition"
            >
              {minting ? '⏳ Minting...' : '🎴 Mint NFT'}
            </button>
          )}
        </div>
        {txHash && (
          <div className="mt-4">
            <p className="text-green-400">✅ NFT Minted!</p>
            <a href={getExplorerTxUrl(txHash)} target="_blank" className="text-purple-400 underline">
              View on VeryScan
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/daily')}
          className="py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
        >
          📅 Daily Reading
        </button>
        <button
          onClick={() => navigate('/compatibility')}
          className="py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition"
        >
          💕 Compatibility
        </button>
      </div>

      <button
        onClick={() => navigate('/calculate')}
        className="w-full py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500 transition text-white"
      >
        ← Calculate Again
      </button>
    </div>
  )
}
