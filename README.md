# CosmicBase

> Onchain Astrology Profile Platform on Base

CosmicBase is a decentralized application that creates immutable birth chart NFTs on the Base blockchain, combining professional Swiss Ephemeris calculations with blockchain technology.

🌐 **Live Demo:** https://cosmicbase.app

## Features

- **Birth Chart NFT**: Mint your unique astrological profile as an NFT
- **Swiss Ephemeris**: Professional-grade planetary calculations
- **Compatibility Check**: Compare cosmic compatibility with other wallets
- **Daily Horoscope**: Personalized insights based on your birth chart
- **Fully Decentralized**: IPFS + Base blockchain (no database)
- **Basename Integration**: Custom cosmic usernames

## Tech Stack

- **Smart Contracts**: Solidity + Hardhat
- **Frontend**: Next.js 14 + TypeScript
- **Web3**: wagmi + viem
- **UI**: Tailwind CSS + shadcn/ui
- **Astrology**: Swiss Ephemeris
- **Storage**: IPFS (Pinata)
- **Blockchain**: Base Sepolia Testnet

## Project Structure

```
CosmicBase/
├── contracts/          # Smart contracts (Hardhat)
├── frontend/          # Next.js application
└── docs/             # Documentation
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Install dependencies
npm install

# Setup contracts
cd contracts
npm install

# Setup frontend
cd ../frontend
npm install
```

### Development

```bash
# Run smart contract tests
npm run test:contracts

# Deploy to Base Sepolia
npm run deploy:testnet

# Run frontend dev server
npm run dev
```

## Smart Contract

**CosmicBaseNFT** - ERC-721 NFT contract on Base Sepolia

- Mint birth chart NFTs
- Store birth data hash (privacy-preserving)
- IPFS metadata integration

## Base Batches 002: Builder Track

This project is built for Base Batches 002: Builder Track.

### Requirements Met:

- Functioning onchain app on Base
- Open-source GitHub repository
- Deployed to Base testnet
- Publicly accessible URL
- Basenames integration
- Demo video

## Privacy

Birth data is stored as a hash onchain, with full details stored in IPFS metadata. Users maintain full control over their astrological data.

## License

MIT
