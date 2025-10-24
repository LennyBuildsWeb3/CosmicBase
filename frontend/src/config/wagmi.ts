import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// WalletConnect Project ID from env
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: 'CosmicBase',
        description: 'Mint your birth chart as an NFT on Base blockchain',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://cosmicbase.xyz',
        icons: ['https://cosmicbase.xyz/icon.png']
      },
      showQrModal: true
    })
  ],
  transports: {
    [baseSepolia.id]: http()
  }
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
