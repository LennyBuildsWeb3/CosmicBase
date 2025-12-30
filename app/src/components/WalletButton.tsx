import { useState } from 'react'
import { connectWallet } from '../lib/wallet'
import { BrowserProvider } from 'ethers'

interface Props {
  onConnect: (address: string, walletType: 'metamask' | 'wepin', provider?: BrowserProvider) => void
}

let wepinProviderInstance: any = null

export function WalletButton({ onConnect }: Props) {
  const [address, setAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<'metamask' | 'wepin' | null>(null)
  const [loading, setLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleMetaMask = async () => {
    setLoading(true)
    setShowOptions(false)
    const result = await connectWallet()
    if (result) {
      setAddress(result.address)
      setWalletType('metamask')
      onConnect(result.address, 'metamask')
    }
    setLoading(false)
  }

  const handleWepin = async () => {
    setLoading(true)
    setShowOptions(false)
    try {
      const { WepinProvider } = await import('@wepin/provider-js')
      
      const wepinProvider = new WepinProvider({
        appId: import.meta.env.VITE_WEPIN_APP_ID,
        appKey: import.meta.env.VITE_WEPIN_APP_KEY,
      })
      await wepinProvider.init({ defaultLanguage: 'en', defaultCurrency: 'USD' })
      wepinProviderInstance = wepinProvider
      
      // Get EIP-1193 provider for Very Chain
      const eip1193Provider = await wepinProvider.getProvider('evmvery')
      
      // Get accounts
      const accounts = await eip1193Provider.request({ method: 'eth_requestAccounts' }) as string[]
      
      if (accounts.length > 0) {
        const ethersProvider = new BrowserProvider(eip1193Provider)
        setAddress(accounts[0])
        setWalletType('wepin')
        onConnect(accounts[0], 'wepin', ethersProvider)
      }
    } catch (e) {
      console.error('Wepin error:', e)
      alert('Wepin error: ' + (e as Error).message)
    }
    setLoading(false)
  }

  if (address) {
    return (
      <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
        {walletType === 'wepin' ? '💎' : '🦊'} {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={loading}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition disabled:opacity-50"
      >
        {loading ? '⏳ Connecting...' : '🔗 Connect Wallet'}
      </button>
      
      {showOptions && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10 min-w-[160px]">
          <button
            onClick={handleWepin}
            className="w-full px-4 py-3 text-left hover:bg-gray-700 transition flex items-center gap-2"
          >
            💎 Wepin
          </button>
          <button
            onClick={handleMetaMask}
            className="w-full px-4 py-3 text-left hover:bg-gray-700 transition flex items-center gap-2 border-t border-gray-700"
          >
            🦊 MetaMask
          </button>
        </div>
      )}
    </div>
  )
}

export function getWepinProvider() {
  return wepinProviderInstance
}
