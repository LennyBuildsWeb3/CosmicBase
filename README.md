# CosmicBase

A privacy-preserving astrology NFT application built with Zama FHEVM. Users can mint their birth chart as an NFT while keeping sensitive birth data encrypted on-chain.

**Built for [Zama Developer Program](https://guild.xyz/zama/developer-program) - Builder Track**

**Live Demo:** https://cosmicbase.app

![CosmicBase Screenshot](assets/screenshot.jpg)

## Demo Video

[Watch on YouTube](https://youtu.be/uF8tEFGNJ_8)

## Features

### Core Privacy Features
- **FHE-encrypted birth data storage**: 7 encrypted fields (year, month, day, hour, minute, latitude, longitude) using Zama's FHEVM
- **Client-side encryption**: Data encrypted in browser before blockchain submission using @zama-fhe/relayer-sdk
- **Zero-knowledge proof**: Input proofs ensure data validity without revealing contents
- **Owner-only decryption**: Only NFT holder can decrypt their sensitive birth data via FHE access control

### Encrypted Computation
- **Encrypted aggregate statistics**: Contract maintains encrypted counters using FHE.add() operations
- **Privacy-preserving analytics**: Track total mints and per-zodiac-sign distributions without decrypting individual data
- **On-chain FHE computation**: True homomorphic operations, not just encrypted storage
- **13 encrypted counters**: 1 total mints + 12 zodiac sign counters, all computed over encrypted values

### Advanced Features
- **Re-encryption on NFT transfer**: Automatic re-encryption ensures previous owner cannot access data after transfer
- **Astrological compatibility calculation**: Compare birth charts between users based on public zodiac signs
- **Coordinate encoding**: Latitude/longitude stored as positive integers with offset encoding for FHE compatibility
- **One mint per wallet**: Prevents duplicate birth charts and ensures data integrity
- **IPFS metadata storage**: Decentralized storage for chart visualizations and metadata

### Security & Compliance
- **Access control validation**: FHE.allow() and FHE.allowThis() permissions properly enforced
- **Input validation**: Comprehensive checks for zodiac signs (1-12), metadata URIs, and data integrity
- **Privacy Policy and legal disclaimers**: GDPR/CCPA compliant privacy notices
- **Verified smart contract**: Publicly verified on Etherscan for transparency
- **Production-ready security**: 40 passing unit and integration tests covering all critical paths

### User Experience
- **Modern UI/UX**: Clean, responsive interface built with Next.js and TailwindCSS
- **Real-time chart generation**: SVG natal chart visualization with customization options
- **Multiple wallet support**: MetaMask, WalletConnect, and other Web3 wallets
- **Testnet deployment**: Live on Ethereum Sepolia for safe testing
- **Gas optimization**: Efficient FHE operations within reasonable gas limits

## Problem

Birth charts contain sensitive personal information including exact birth date, time, and location. Traditional NFT solutions store this data in plain text, creating privacy and security risks. This information can be used for identity theft or personal profiling.

## Solution

CosmicBase uses Zama's Fully Homomorphic Encryption (FHE) to encrypt birth data before storing it on-chain. Only the NFT owner can decrypt and view their private information. The application displays public astrological signs (Sun, Moon, Rising) while keeping the underlying birth data completely private.

### FHE Computation

Beyond just storing encrypted data, CosmicBase performs **encrypted computation on-chain**:

- **Encrypted Aggregate Stats**: The contract maintains encrypted counters for total mints and per-zodiac-sign counts using `FHE.add()` operations
- Each mint triggers encrypted arithmetic operations without ever decrypting the underlying values
- This demonstrates the true power of FHE - computation on encrypted data while maintaining privacy

## How It Works

1. User connects wallet and enters birth information
2. Frontend encrypts the data using @zama-fhe/relayer-sdk
3. Encrypted data is sent to the smart contract
4. Contract stores encrypted values using FHEVM types
5. NFT is minted with public signs and encrypted private data
6. Only the owner can request decryption of their birth data

## Smart Contract

The FHECosmicBaseNFT contract stores encrypted birth data using Zama's FHEVM types:

```solidity
struct EncryptedBirthData {
    euint16 birthYear;
    euint8 birthMonth;
    euint8 birthDay;
    euint8 birthHour;
    euint8 birthMinute;
    euint32 latitude;
    euint32 longitude;
}
```

Key implementation details:
- Uses @fhevm/solidity v0.9.1
- Encrypted inputs via externalEuint types
- Access control with FHE.allow() and FHE.allowThis()
- Coordinates stored as offset-encoded unsigned integers
- **FHE Computation**: Uses `FHE.add()` for encrypted aggregate statistics
- Encrypted counters track total mints and per-sign distributions without decryption

## Deployed Contract

| Network | Address | Verified |
|---------|---------|----------|
| Ethereum Sepolia | 0xE37743B10BB6E48436072DE66B516A40335E2632 | [Etherscan](https://sepolia.etherscan.io/address/0xE37743B10BB6E48436072DE66B516A40335E2632#code) |

## Tech Stack

- Zama FHEVM (@fhevm/solidity v0.9.1, @zama-fhe/relayer-sdk)
- Solidity 0.8.24
- Hardhat
- Next.js 14
- Wagmi v2 / Viem
- IPFS (Pinata)
- TailwindCSS

## Installation

```bash
git clone https://github.com/LennyBuildsWeb3/CosmicBase.git
cd cosmicbase

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

## Environment Setup

Create `frontend/.env.local`:

```
NEXT_PUBLIC_FHE_CONTRACT_ADDRESS=0xE37743B10BB6E48436072DE66B516A40335E2632
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
```

Create `contracts-fhe/.env`:

```
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Running Locally

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Deploying Contracts

```bash
cd contracts-fhe
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

## Project Structure

```
cosmicbase/
├── contracts-fhe/
│   ├── contracts/
│   │   └── FHECosmicBaseNFT.sol
│   ├── scripts/
│   │   └── deploy.ts
│   └── hardhat.config.ts
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── config/
│       └── lib/
│           ├── fhe.ts
│           ├── astrology.ts
│           └── pinata.ts
└── README.md
```

## FHE Integration

The frontend uses @zama-fhe/relayer-sdk to encrypt user input:

```typescript
const input = instance.createEncryptedInput(contractAddress, userAddress)

input.add16(birthData.year)
input.add8(birthData.month)
input.add8(birthData.day)
input.add8(birthData.hour)
input.add8(birthData.minute)
input.add32(latitudeInt)
input.add32(longitudeInt)

const encrypted = input.encrypt()
```

Encrypted handles and input proof are sent to the contract. The contract verifies and stores the encrypted values, granting access only to the token owner.

## Unit Tests

Run the test suite:

```bash
cd contracts-fhe
npx hardhat test
```

Test coverage includes:
- Deployment and initialization (4 tests)
- Stats initialization and FHE computation (3 tests)
- Minting validation (5 tests)
- User minting status (2 tests)
- Compatibility calculation (1 test)
- Access control (1 test)
- ERC721 compliance (2 tests)
- Sign compatibility logic (2 tests)
- Gas estimation (2 tests)
- FHE integration tests (18 tests)
  - Full minting flow with encrypted inputs (1 test)
  - FHE computation and encrypted counters (4 tests)
  - Access control for encrypted data (4 tests)
  - NFT transfer and re-encryption (3 tests)
  - Double minting prevention (2 tests)
  - Public birth chart data (2 tests)
  - Metadata updates (2 tests)

Total: 40 passing tests

## Manual Testing

The application is deployed on Ethereum Sepolia testnet. You need Sepolia ETH to mint NFTs.

To test manually:
1. Visit https://cosmicbase.app
2. Connect your wallet (MetaMask or WalletConnect)
3. Enter birth information
4. Approve transaction to mint NFT
5. View your encrypted birth chart NFT

## Business Model and Monetization

### Market Opportunity

The global astrology market is valued at over $12 billion and growing. CosmicBase addresses a critical gap in this market: privacy-preserving astrological services on the blockchain.

### Target Audience

- Privacy-conscious astrology enthusiasts
- Web3 natives interested in personal sovereignty
- NFT collectors seeking unique utility
- Astrology platforms requiring privacy infrastructure

### Revenue Streams

#### Free Tier
- Mint one birth chart NFT per wallet
- View your encrypted birth data
- Basic sun/moon/rising sign display
- One free compatibility check

#### Premium Subscription ($4.99/month)
- Unlimited compatibility reports with other users
- Advanced astrological chart readings
- Detailed birth chart analysis
- AI-powered predictions (using encrypted data)
- Priority customer support
- Exclusive chart customization options

#### Enterprise API ($99-$499/month)
- Astrology platform integration
- Bulk NFT minting for communities
- Custom chart designs and branding
- White-label solution
- Dedicated support and SLAs
- Advanced analytics dashboard

#### NFT Marketplace
- Secondary market for rare birth charts
- Trading fees: 2.5% per transaction
- Special edition charts (celebrity birthdays, historical dates)
- Limited edition zodiac collections

### Revenue Projections

**Year 1:**
- Target users: 10,000
- Premium conversion: 5% (500 users)
- Monthly recurring revenue: $2,495
- Annual revenue: ~$30,000

**Year 2:**
- Target users: 50,000
- Premium conversion: 7% (3,500 users)
- Enterprise clients: 5-10
- Annual revenue: ~$250,000

### Competitive Advantage

1. **First-mover advantage**: Only FHE-based astrology NFT platform
2. **Privacy by design**: Birth data never exposed, even to platform
3. **True ownership**: Users control their encrypted data via NFT
4. **Proven technology**: Built on Zama's production-ready FHEVM
5. **Regulatory compliance**: Privacy-first approach aligns with GDPR/CCPA

### Go-to-Market Strategy

1. **Phase 1 (Months 1-3)**: Community building
   - Launch on Ethereum mainnet
   - Partner with astrology influencers
   - Airdrops to astrology DAOs

2. **Phase 2 (Months 4-6)**: Premium features
   - Launch subscription model
   - AI-powered chart readings
   - Mobile app development

3. **Phase 3 (Months 7-12)**: Enterprise expansion
   - API for astrology platforms
   - B2B partnerships
   - Multi-chain deployment

### Sustainability

- **Low operating costs**: Decentralized infrastructure
- **Recurring revenue**: Subscription-based model
- **Scalable**: Smart contract handles unlimited users
- **Network effects**: More users = more compatibility data = more value

## License

MIT

## Links

- Live App: https://cosmicbase.app
- Contract: https://sepolia.etherscan.io/address/0xE37743B10BB6E48436072DE66B516A40335E2632#code
- Zama FHEVM: https://docs.zama.org/protocol
