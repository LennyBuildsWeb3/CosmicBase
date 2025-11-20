import { http, createConfig, fallback } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// WalletConnect Project ID from env
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Infura API Key for Sepolia
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || ''

// RPC configuration with fallbacks for better reliability
const sepoliaTransport = infuraApiKey
  ? fallback([
      http(`https://sepolia.infura.io/v3/${infuraApiKey}`, { timeout: 20000 }),
      http('https://ethereum-sepolia-rpc.publicnode.com', { timeout: 20000 }),
      http('https://rpc.sepolia.org', { timeout: 30000 }),
    ])
  : fallback([
      http('https://ethereum-sepolia-rpc.publicnode.com', { timeout: 20000 }),
      http('https://rpc2.sepolia.org', { timeout: 20000 }),
      http('https://rpc.sepolia.org', { timeout: 30000 }),
    ])

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: 'CosmicBase',
        description: 'Privacy-preserving birth chart NFTs with FHE encryption',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://cosmicbase.xyz',
        icons: ['https://cosmicbase.xyz/icon.png']
      },
      showQrModal: true
    })
  ],
  transports: {
    [sepolia.id]: sepoliaTransport
  }
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
