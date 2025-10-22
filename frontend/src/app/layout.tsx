import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from '@/providers/Web3Provider'

export const metadata: Metadata = {
  title: 'CosmicBase - Onchain Astrology',
  description: 'Mint your birth chart as an NFT on Base blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
