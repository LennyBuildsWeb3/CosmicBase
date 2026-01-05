# CosmicBase - Very Hackathon 2025 Submission

## 🌟 Project Name
**CosmicBase** - Eastern Saju meets Western Astrology on Web3

## 🔗 Links
- **Live Demo:** https://cosmicbase.app
- **Smart Contract:** [0xbE6962010697f1B914166209a0E5B18A56bf5708](https://veryscan.io/address/0xbE6962010697f1B914166209a0E5B18A56bf5708)
- **GitHub:** https://github.com/LennyBuildsWeb3/CosmicBase

---

## 📝 Project Description

CosmicBase is a privacy-first astrology platform that uniquely combines Korean Four Pillars (四柱 Saju) with Western Zodiac, built entirely on Very Network.

### The Problem
- 50M+ people use astrology apps daily worldwide
- No existing app combines Eastern (Saju) and Western astrology systems
- Traditional apps are centralized, harvest user data, and offer no ownership
- Korean Saju (사주) has deep cultural significance but lacks modern Web3 integration

### Our Solution
CosmicBase bridges Eastern and Western astrology traditions while embracing Web3 principles:
- **Dual System Analysis:** Combines 2000+ year old Korean Saju with Western Zodiac
- **Privacy-First:** Birth data stored locally only, never on servers
- **True Ownership:** Mint your cosmic profile as an NFT on Very Chain
- **VeryChat Integration:** Seamless authentication with VeryChat ecosystem

---

## ✨ Key Features

### 🔮 Saju Analysis (四柱)
Traditional Korean Four Pillars of Destiny calculation based on birth year, month, day, and hour. Determines your dominant element (Wood, Fire, Earth, Metal, Water).

### ⭐ Western Zodiac
Sun sign calculation with element mapping (Fire, Earth, Air, Water signs).

### 🌌 Combined Cosmic Profile
Unique fusion reading like "Cosmic Fire Capricorn" - merging Eastern elements with Western signs.

### 📅 Daily Horoscope
Personalized daily guidance based on your Saju element and Zodiac sign with lucky numbers and colors.

### 💕 Compatibility Check
Relationship matching using both Saju element harmony and Zodiac compatibility.

### 🎴 NFT Minting
Save your cosmic profile permanently on Very Chain as an ERC-721 NFT.

### 🔐 VeryChat Authentication
Secure, passwordless login using VeryChat verification codes.

### 💎 Wepin Wallet Integration
Easy Web3 onboarding with Wepin's embedded wallet solution.

---

## 🛠 Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CosmicBase App                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend: React 19 + Vite + TypeScript + Tailwind CSS      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  VeryChat   │  │   Wepin     │  │     MetaMask        │  │
│  │    Auth     │  │   Wallet    │  │     (Fallback)      │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │            │
│  ┌──────▼────────────────▼─────────────────────▼──────────┐ │
│  │              Local Storage (Privacy Layer)             │ │
│  │         Birth Data • Cosmic Profile • Auth Tokens      │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌───────────────────────────▼────────────────────────────┐ │
│  │                   Calculation Engine                   │ │
│  │     Saju Calculator  •  Zodiac Calculator  •  Compat   │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌───────────────────────────▼────────────────────────────┐ │
│  │                Very Chain (ID: 4613)                   │ │
│  │              CosmicNFT Smart Contract                  │ │
│  │         0xbE6962010697f1B914166209a0E5B18A56bf5708     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Very Network Integration

| Integration | Usage |
|-------------|-------|
| **VeryChat API** | User authentication via verification codes |
| **Very Chain** | NFT smart contract deployment & minting |
| **Wepin Wallet** | Embedded wallet for seamless Web3 UX |
| **VeryScan** | Transaction verification & NFT viewing |

### Smart Contract Details
- **Contract:** CosmicNFT (ERC-721)
- **Address:** `0xbE6962010697f1B914166209a0E5B18A56bf5708`
- **Network:** Very Chain (Chain ID: 4613)
- **Functions:** `mint(address to, string uri)`, `tokenURI(uint256 tokenId)`

---

## 🎯 Target Users

1. **Korean Users** - Saju (사주) is culturally significant in Korea
2. **Global Astrology Enthusiasts** - 50M+ daily active users worldwide
3. **Web3-Curious Mainstream Users** - Easy onboarding via Wepin
4. **Privacy-Conscious Users** - Data stays on device

---

## 🚀 How It Works

1. **Login** - Authenticate with VeryChat handle
2. **Calculate** - Enter birth date/time for Saju + Zodiac analysis
3. **Discover** - View your unique Cosmic Profile
4. **Daily** - Check personalized daily horoscope
5. **Match** - Test compatibility with others
6. **Mint** - Save profile as NFT on Very Chain
7. **Share** - Share results on Twitter/Telegram

---

## 🔒 Privacy Approach

| Data | Storage | On-Chain |
|------|---------|----------|
| Birth Date/Time | Local Storage Only | ❌ Never |
| Cosmic Profile | Local Storage Only | ❌ Never |
| NFT Metadata | IPFS/Data URI | ✅ Hash Only |
| Personal Info | Never Collected | ❌ Never |

**Philosophy:** User owns their data. We never see it.

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, Custom Cosmic Theme |
| Blockchain | ethers.js v6, Very Chain |
| Smart Contract | Solidity 0.8.19 |
| Auth | VeryChat API |
| Wallet | Wepin SDK, MetaMask |

---

## 🎨 Design Philosophy

- **Cosmic Theme:** Dark purple gradients, starfield animations
- **Element Colors:** Wood(green), Fire(red), Earth(yellow), Metal(silver), Water(blue)
- **Cultural Respect:** Traditional Chinese characters (四柱) for Saju pillars
- **Modern UX:** Clean, intuitive interface with smooth animations

---

## 📱 Screenshots

### Home Page
Cosmic landing with Five Elements display

### Saju Analysis
Four Pillars with element-colored Chinese characters

### Zodiac Result
Western zodiac symbol with element glow effects

### NFT Minting
Wepin wallet integration for seamless minting

---

## 🏆 Why CosmicBase?

✅ **Unique Niche** - First Saju + Zodiac Web3 platform  
✅ **Cultural Appeal** - Saju resonates with Korean audience  
✅ **Real Utility** - Daily horoscope brings users back  
✅ **Privacy-First** - Aligns with Web3 values  
✅ **Full Integration** - VeryChat + Wepin + Very Chain  
✅ **Working Product** - Live demo with real NFT minting  

---

## 👥 Team

Built with ❤️ for Very Hackathon 2025

---

## 📄 License

MIT License

---

## 🔮 Future Roadmap

- [ ] AI-powered personalized readings
- [ ] VERY token rewards for daily engagement
- [ ] Social features via VeryChat
- [ ] Multi-language support (Korean, Japanese)
- [ ] Premium detailed Saju reports
