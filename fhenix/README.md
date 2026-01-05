# ☯ CosmicBase FHE Edition

**Privacy-first astrology powered by Fully Homomorphic Encryption**

🔐 Your birth data stays encrypted on-chain. Only you can decrypt it.

---

## 🔗 Links

| | |
|---|---|
| 🌐 **Live Demo** | [fhenix.cosmicbase.app](https://fhenix.cosmicbase.app) |
| 📜 **Contract** | [View on BaseScan](https://sepolia.basescan.org/address/0x8488105D224acf122d36ae00E7ad76654F948f7C) |
| 🏠 **Main App** | [cosmicbase.app](https://cosmicbase.app) |
| 📚 **Fhenix Docs** | [cofhe-docs.fhenix.zone](https://cofhe-docs.fhenix.zone) |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔒 **Encrypted Birth Data** | Month, day, year, hour stored as FHE ciphertext |
| 🌿 **Private Saju Analysis** | Four Pillars element calculation (Wood/Fire/Earth/Metal/Water) |
| ⭐ **Confidential Zodiac** | Sun sign stored encrypted (Aries-Pisces) |
| 💕 **Private Compatibility** | Check compatibility without revealing your data |

---

## 🔗 Smart Contract

| Network | Chain ID | Contract Address |
|---------|----------|------------------|
| Base Sepolia | 84532 | `0x8488105D224acf122d36ae00E7ad76654F948f7C` |

**Explorer:** [View on BaseScan](https://sepolia.basescan.org/address/0x8488105D224acf122d36ae00E7ad76654F948f7C)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **FHE** | Fhenix CoFHE v0.3.1 |
| **Blockchain** | Base Sepolia (L2) |
| **Smart Contract** | Solidity 0.8.25 |
| **Client SDK** | cofhejs |
| **Framework** | Hardhat |

---

## 🔐 How FHE Privacy Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  Encrypted   │────▶│  On-Chain   │
│ (cofhejs)   │     │   Data       │     │  Storage    │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  FHE Compute │
                    │ (Encrypted)  │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Only Owner  │
                    │  Can Decrypt │
                    └──────────────┘
```

1. **Encrypt** - Birth data encrypted client-side before sending
2. **Store** - Only ciphertext stored on blockchain
3. **Compute** - Compatibility calculated on encrypted data
4. **Decrypt** - Only data owner can unseal their data

---

## 📜 Contract Functions

```solidity
// Store encrypted profile
function storeProfile(
    InEuint8 _month,
    InEuint8 _day,
    InEuint16 _year,
    InEuint8 _hour,
    InEuint8 _element,
    InEuint8 _zodiac
) external

// Get encrypted profile (only owner can decrypt)
function getProfile(address user) external view returns (
    euint8 month, euint8 day, euint16 year, 
    euint8 hour, euint8 element, euint8 zodiac
)

// Check if user has profile
function hasProfile(address user) external view returns (bool)

// Encrypted compatibility check
function checkCompatibility(address partner) external returns (euint8)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- pnpm
- Base Sepolia ETH ([Faucet](https://faucets.chain.link/base-sepolia))

### Setup

```bash
# Clone
git clone <repo>
cd fhenix-app

# Install
pnpm install

# Configure
cp .env.example .env
# Add your PRIVATE_KEY to .env

# Compile
pnpm hardhat compile

# Deploy (optional - already deployed)
pnpm hardhat deploy-cosmic --network base-sepolia
```

---

## ⚙️ Environment Variables

```env
PRIVATE_KEY=0x...your_private_key
```

---

## 🌐 Network Info

| Property | Value |
|----------|-------|
| Network | Base Sepolia |
| Chain ID | 84532 |
| RPC | https://sepolia.base.org |
| Explorer | https://sepolia.basescan.org |
| Currency | ETH |

---

## 📁 Project Structure

```
fhenix-app/
├── contracts/
│   ├── CosmicBaseFHE.sol    # Main FHE contract
│   └── Counter.sol          # Example contract
├── tasks/
│   ├── deploy-cosmic.ts     # Deploy task
│   └── ...
├── test/
│   └── Counter.test.ts
├── hardhat.config.ts
└── package.json
```

---

## 🔮 Element & Zodiac Encoding

**Elements (Saju):**
| Value | Element |
|-------|---------|
| 0 | Wood 🌿 |
| 1 | Fire 🔥 |
| 2 | Earth 🌍 |
| 3 | Metal ⚔️ |
| 4 | Water 💧 |

**Zodiac Signs:**
| Value | Sign |
|-------|------|
| 0 | Aries ♈ |
| 1 | Taurus ♉ |
| 2 | Gemini ♊ |
| 3 | Cancer ♋ |
| 4 | Leo ♌ |
| 5 | Virgo ♍ |
| 6 | Libra ♎ |
| 7 | Scorpio ♏ |
| 8 | Sagittarius ♐ |
| 9 | Capricorn ♑ |
| 10 | Aquarius ♒ |
| 11 | Pisces ♓ |

---

## 🏆 Built With

<p align="center">
  <img src="https://img.shields.io/badge/Fhenix-FHE-purple" alt="Fhenix">
  <img src="https://img.shields.io/badge/Base-Sepolia-blue" alt="Base">
  <img src="https://img.shields.io/badge/Solidity-0.8.25-green" alt="Solidity">
</p>

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 🔗 More Links

- **GitHub:** [github.com/LevCey/fhenix](https://github.com/LevCey/fhenix)
- **Fhenix:** [fhenix.io](https://fhenix.io)
