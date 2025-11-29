# CosmicBase Demo Video Script

**Duration:** 4-5 minutes
**Target Audience:** Zama Developer Program judges and crypto/privacy enthusiasts

---

## 🎬 Video Structure

### **Scene 1: Hook & Problem** (0:00 - 0:45)

**[SCREEN: Show cosmicbase.app homepage]**

**Voiceover:**
> "Birth charts reveal incredibly sensitive personal information: your exact birth date, time, and location. Traditional astrology apps store this data in plain text databases, creating massive privacy and security risks."

**[SCREEN: Show news headlines about data breaches]**

> "What if you could mint your birth chart as an NFT, while keeping your birth data completely private—even from the platform itself?"

**[TRANSITION: Fade to CosmicBase logo]**

---

### **Scene 2: Solution - FHE Technology** (0:45 - 1:30)

**[SCREEN: Show architecture diagram or simple animation]**

**Voiceover:**
> "Introducing CosmicBase: The world's first privacy-preserving astrology NFT platform, built with Zama's Fully Homomorphic Encryption."

**[SCREEN: Highlight FHE features with text overlay]**

**Key Points to Show:**
- "Your birth data is encrypted BEFORE it leaves your browser"
- "Smart contract performs computations on ENCRYPTED data"
- "Only you can decrypt your private information"
- "Even we cannot see your birth data"

**Technical Highlight:**
> "We use 7 encrypted fields: birth year, month, day, hour, minute, and GPS coordinates. The smart contract performs encrypted arithmetic operations using FHE.add(), maintaining aggregate statistics without ever decrypting individual values."

---

### **Scene 3: Live Demo - Minting** (1:30 - 2:30)

**[SCREEN: Record actual minting process on cosmicbase.app]**

**Steps to Show:**
1. **Connect Wallet**
   > "First, connect your Web3 wallet to Ethereum Sepolia testnet."

2. **Enter Birth Information**
   > "Enter your birth details. Notice the privacy disclaimer—this data will be encrypted client-side."

   **[Show the form being filled out]**

3. **Encryption Process**
   > "Our frontend uses Zama's relayer SDK to encrypt your data. Watch as seven separate encrypted values are generated."

   **[SCREEN: Open browser DevTools, show console logs of encryption]**
   ```
   Console output:
   ✓ Encrypting birth year (euint16)
   ✓ Encrypting birth month (euint8)
   ✓ Encrypting coordinates (euint32)
   ✓ Generating zero-knowledge proof
   ```

4. **Transaction**
   > "The encrypted data and proof are sent to the smart contract. No plaintext ever touches the blockchain."

   **[Show MetaMask transaction confirmation]**

5. **Success**
   > "Success! Your birth chart NFT is minted with public zodiac signs, while your sensitive birth data remains encrypted on-chain."

   **[Show the minted NFT with chart visualization]**

---

### **Scene 4: Encrypted Computation Demo** (2:30 - 3:15)

**[SCREEN: Open Etherscan contract page]**

**Voiceover:**
> "Let's verify the encrypted computation is actually happening."

**Steps:**
1. **Show Contract on Etherscan**
   > "Here's our verified contract on Sepolia Etherscan."

   **[Navigate to Read Contract tab]**

2. **Read Encrypted Stats**
   > "We can call 'getEncryptedTotalMints' to see the encrypted counter. Notice it returns a handle—not the actual value."

   **[Show the encrypted handle output: 0x1234...]**

3. **Show Multiple Sign Counters**
   > "Similarly, each zodiac sign has its own encrypted counter. The contract increments these using FHE.add() operations without ever decrypting."

   **[Call getEncryptedSignCount for different signs]**

**Technical Note:**
> "This demonstrates true FHE computation: performing arithmetic on encrypted data while maintaining perfect privacy."

---

### **Scene 5: Re-encryption on Transfer** (3:15 - 3:45)

**[SCREEN: Show code or explain with visuals]**

**Voiceover:**
> "Here's something unique: when you transfer your NFT, we automatically re-encrypt your birth data for the new owner."

**[SCREEN: Show relevant code snippet from contract]**

```solidity
function _update(...) internal override {
    // Re-encrypt data by adding encrypted zero
    data.birthYear = FHE.add(data.birthYear, FHE.asEuint16(0));
    FHE.allow(data.birthYear, to);
    // ... repeat for all fields
}
```

> "This ensures the previous owner cannot decrypt the data after transfer. It's true data ownership with privacy guarantees."

---

### **Scene 6: Test Coverage** (3:45 - 4:15)

**[SCREEN: Show terminal running tests]**

**Voiceover:**
> "Quality matters. Let's look at our test coverage."

**[Run: npx hardhat test]**

**Show output:**
```
✔ 40 passing tests
  ✔ FHE computation tests
  ✔ Access control validation
  ✔ Re-encryption on transfer
  ✔ Input validation
  ✔ Gas optimization
```

> "40 comprehensive tests covering FHE encryption, access control, encrypted computation, and edge cases. This ensures our privacy guarantees are solid."

---

### **Scene 7: Business Potential & Closing** (4:15 - 4:45)

**[SCREEN: Show business model infographic or slides]**

**Voiceover:**
> "CosmicBase targets the $12 billion astrology market with a privacy-first approach."

**Quick Stats:**
- "Free tier: Basic birth chart NFT"
- "Premium: $4.99/month for unlimited compatibility reports"
- "Enterprise API: For astrology platforms"
- "Year 1 projection: $30K ARR from 10,000 users"

> "We're not just building a demo—we're building a sustainable business that puts user privacy first."

**[SCREEN: Return to homepage showing the live demo]**

> "CosmicBase: Your birth chart, your data, your privacy. Powered by Zama's FHEVM."

**[SCREEN: Show key links]**
- Live demo: cosmicbase.app
- Contract: 0xE37743B10BB6E48436072DE66B516A40335E2632
- GitHub: github.com/LennyBuildsWeb3/CosmicBase

**[Fade out]**

---

## 🎥 Production Tips

### Recording Tools
- **Screen recording**: OBS Studio (free) or Loom
- **Voiceover**: Audacity (free) or built-in recording
- **Editing**: DaVinci Resolve (free) or iMovie

### Visual Elements to Include
1. ✅ Homepage walkthrough
2. ✅ Minting process (actual transaction)
3. ✅ Browser DevTools showing encryption
4. ✅ Etherscan contract verification
5. ✅ Terminal showing test results
6. ✅ Code snippets (syntax highlighted)
7. ✅ Business model slides

### Key Highlights
- **Show, don't just tell**: Actual minting transaction
- **Prove it works**: Console logs, Etherscan verification
- **Technical depth**: Code snippets, test coverage
- **Business viability**: Clear monetization strategy

### Quality Checklist
- [ ] Clear audio (no background noise)
- [ ] Smooth screen transitions
- [ ] Highlighted UI elements (cursor, arrows)
- [ ] Professional pacing (not too fast)
- [ ] Proper lighting (if showing face)
- [ ] 1080p resolution minimum

---

## 📝 Alternative: Shorter Version (2-3 minutes)

If you want a quick version:

1. **Problem** (0:00-0:20): Birth data privacy issue
2. **Solution** (0:20-0:40): FHE explanation
3. **Demo** (0:40-1:40): Live minting process
4. **Technical** (1:40-2:20): Encrypted computation proof
5. **Closing** (2:20-2:40): Business model + links

---

## 🎯 What Makes This Video Stand Out

1. **Actually shows FHE working**: Not just claiming, proving with DevTools
2. **Technical depth**: Code snippets, test coverage, Etherscan
3. **Business focus**: Clear monetization, market size
4. **Professional**: Scripted, clear, well-paced
5. **Unique**: First astrology + FHE project

---

## Next Steps After Recording

1. Upload to YouTube
2. Update README with new video link
3. Share on Twitter/X with Zama tag
4. Submit to Zama Developer Program

Good luck with your recording! 🎬
