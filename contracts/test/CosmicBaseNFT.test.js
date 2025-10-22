const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CosmicBaseNFT", function () {
  let cosmicBaseNFT;
  let owner;
  let addr1;
  let addr2;

  // Sample birth chart data
  const sampleBirthDataHash = ethers.keccak256(ethers.toUtf8Bytes("1990-01-15T10:30:00+40.7128-74.0060"));
  const sampleMetadataURI = "ipfs://QmXyZ123...";
  const sunSign = 10; // Capricorn
  const moonSign = 7;  // Libra
  const risingSign = 5; // Leo

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CosmicBaseNFT = await ethers.getContractFactory("CosmicBaseNFT");
    cosmicBaseNFT = await CosmicBaseNFT.deploy();
    await cosmicBaseNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await cosmicBaseNFT.name()).to.equal("CosmicBase Birth Chart");
      expect(await cosmicBaseNFT.symbol()).to.equal("COSMIC");
    });

    it("Should set the right owner", async function () {
      expect(await cosmicBaseNFT.owner()).to.equal(owner.address);
    });

    it("Should start with zero total supply", async function () {
      expect(await cosmicBaseNFT.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint a birth chart NFT successfully", async function () {
      await expect(
        cosmicBaseNFT.connect(addr1).mintBirthChart(
          sampleBirthDataHash,
          sampleMetadataURI,
          sunSign,
          moonSign,
          risingSign
        )
      )
        .to.emit(cosmicBaseNFT, "ChartMinted")
        .withArgs(addr1.address, 1, sampleBirthDataHash, sampleMetadataURI, sunSign, moonSign, risingSign);

      expect(await cosmicBaseNFT.totalSupply()).to.equal(1);
      expect(await cosmicBaseNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await cosmicBaseNFT.hasMinted(addr1.address)).to.be.true;
    });

    it("Should prevent minting twice from same address", async function () {
      await cosmicBaseNFT.connect(addr1).mintBirthChart(
        sampleBirthDataHash,
        sampleMetadataURI,
        sunSign,
        moonSign,
        risingSign
      );

      await expect(
        cosmicBaseNFT.connect(addr1).mintBirthChart(
          sampleBirthDataHash,
          sampleMetadataURI,
          sunSign,
          moonSign,
          risingSign
        )
      ).to.be.revertedWith("Already minted a birth chart");
    });

    it("Should reject invalid zodiac signs", async function () {
      await expect(
        cosmicBaseNFT.connect(addr1).mintBirthChart(
          sampleBirthDataHash,
          sampleMetadataURI,
          0, // Invalid
          moonSign,
          risingSign
        )
      ).to.be.revertedWith("Invalid sun sign");

      await expect(
        cosmicBaseNFT.connect(addr1).mintBirthChart(
          sampleBirthDataHash,
          sampleMetadataURI,
          sunSign,
          13, // Invalid
          risingSign
        )
      ).to.be.revertedWith("Invalid moon sign");

      await expect(
        cosmicBaseNFT.connect(addr1).mintBirthChart(
          sampleBirthDataHash,
          sampleMetadataURI,
          sunSign,
          moonSign,
          15 // Invalid
        )
      ).to.be.revertedWith("Invalid rising sign");
    });

    it("Should reject empty metadata URI", async function () {
      await expect(
        cosmicBaseNFT.connect(addr1).mintBirthChart(
          sampleBirthDataHash,
          "",
          sunSign,
          moonSign,
          risingSign
        )
      ).to.be.revertedWith("Metadata URI required");
    });
  });

  describe("Birth Chart Data", function () {
    beforeEach(async function () {
      await cosmicBaseNFT.connect(addr1).mintBirthChart(
        sampleBirthDataHash,
        sampleMetadataURI,
        sunSign,
        moonSign,
        risingSign
      );
    });

    it("Should retrieve birth chart data correctly", async function () {
      const chart = await cosmicBaseNFT.getBirthChart(1);

      expect(chart.birthDataHash).to.equal(sampleBirthDataHash);
      expect(chart.metadataURI).to.equal(sampleMetadataURI);
      expect(chart.sunSign).to.equal(sunSign);
      expect(chart.moonSign).to.equal(moonSign);
      expect(chart.risingSign).to.equal(risingSign);
      expect(chart.mintTimestamp).to.be.greaterThan(0);
    });

    it("Should get token by address", async function () {
      const tokenId = await cosmicBaseNFT.getTokenByAddress(addr1.address);
      expect(tokenId).to.equal(1);
    });

    it("Should return 0 for address that hasn't minted", async function () {
      const tokenId = await cosmicBaseNFT.getTokenByAddress(addr2.address);
      expect(tokenId).to.equal(0);
    });

    it("Should check if user has minted", async function () {
      expect(await cosmicBaseNFT.hasUserMinted(addr1.address)).to.be.true;
      expect(await cosmicBaseNFT.hasUserMinted(addr2.address)).to.be.false;
    });
  });

  describe("Compatibility", function () {
    beforeEach(async function () {
      // Addr1: Capricorn Sun, Libra Moon, Leo Rising
      await cosmicBaseNFT.connect(addr1).mintBirthChart(
        sampleBirthDataHash,
        sampleMetadataURI,
        10, // Capricorn (Earth)
        7,  // Libra (Air)
        5   // Leo (Fire)
      );

      // Addr2: Taurus Sun, Libra Moon, Virgo Rising
      await cosmicBaseNFT.connect(addr2).mintBirthChart(
        ethers.keccak256(ethers.toUtf8Bytes("1992-05-10T14:20:00+34.0522-118.2437")),
        "ipfs://QmAbc456...",
        2,  // Taurus (Earth)
        7,  // Libra (Air)
        6   // Virgo (Earth)
      );
    });

    it("Should calculate compatibility score", async function () {
      const score = await cosmicBaseNFT.calculateCompatibility(1, 2);

      expect(score).to.be.greaterThan(0);
      expect(score).to.be.lessThanOrEqual(100);

      // Expected: High compatibility due to matching elements and moon signs
      // Actual calculation may vary based on algorithm
      expect(score).to.equal(95);
    });

    it("Should reject compatibility check for non-existent tokens", async function () {
      await expect(
        cosmicBaseNFT.calculateCompatibility(1, 999)
      ).to.be.revertedWith("Token 2 does not exist");
    });
  });

  describe("Metadata Updates", function () {
    const newMetadataURI = "ipfs://QmNewHash123...";

    beforeEach(async function () {
      await cosmicBaseNFT.connect(addr1).mintBirthChart(
        sampleBirthDataHash,
        sampleMetadataURI,
        sunSign,
        moonSign,
        risingSign
      );
    });

    it("Should allow token owner to update metadata URI", async function () {
      await expect(
        cosmicBaseNFT.connect(addr1).updateMetadataURI(1, newMetadataURI)
      )
        .to.emit(cosmicBaseNFT, "MetadataUpdated")
        .withArgs(1, newMetadataURI);

      const chart = await cosmicBaseNFT.getBirthChart(1);
      expect(chart.metadataURI).to.equal(newMetadataURI);
    });

    it("Should prevent non-owners from updating metadata", async function () {
      await expect(
        cosmicBaseNFT.connect(addr2).updateMetadataURI(1, newMetadataURI)
      ).to.be.revertedWith("Not token owner");
    });

    it("Should reject empty metadata URI", async function () {
      await expect(
        cosmicBaseNFT.connect(addr1).updateMetadataURI(1, "")
      ).to.be.revertedWith("Invalid URI");
    });
  });

  describe("ERC721 Functionality", function () {
    beforeEach(async function () {
      await cosmicBaseNFT.connect(addr1).mintBirthChart(
        sampleBirthDataHash,
        sampleMetadataURI,
        sunSign,
        moonSign,
        risingSign
      );
    });

    it("Should return correct token URI", async function () {
      const uri = await cosmicBaseNFT.tokenURI(1);
      expect(uri).to.equal(sampleMetadataURI);
    });

    it("Should support ERC721 interface", async function () {
      const ERC721InterfaceId = "0x80ac58cd";
      expect(await cosmicBaseNFT.supportsInterface(ERC721InterfaceId)).to.be.true;
    });
  });
});
