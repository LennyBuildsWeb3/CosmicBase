import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FHECosmicBaseNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("FHECosmicBaseNFT", function () {
  let contract: FHECosmicBaseNFT;
  let contractAddress: string;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const sampleMetadataURI = "ipfs://QmSampleHash123456789";
  const sunSign = 10;
  const moonSign = 7;
  const risingSign = 5;
  const birthYear = 1990;
  const birthMonth = 1;
  const birthDay = 15;
  const birthHour = 10;
  const birthMinute = 30;
  const latitudeEncoded = 1307128;
  const longitudeEncoded = 1059940;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("FHECosmicBaseNFT");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
    contractAddress = await contract.getAddress();
  });

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      expect(await contract.name()).to.equal("CosmicBase FHE Birth Chart");
      expect(await contract.symbol()).to.equal("COSMIC-FHE");
    });

    it("Should set correct owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should start with zero supply", async function () {
      expect(await contract.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT with encrypted data", async function () {
      const enc = await fhevm.createEncryptedInput(contractAddress, user1.address)
        .add16(birthYear).add8(birthMonth).add8(birthDay)
        .add8(birthHour).add8(birthMinute)
        .add32(latitudeEncoded).add32(longitudeEncoded).encrypt();

      await expect(contract.connect(user1).mintBirthChart(
        enc.handles[0], enc.handles[1], enc.handles[2], enc.handles[3],
        enc.handles[4], enc.handles[5], enc.handles[6], enc.inputProof,
        sampleMetadataURI, sunSign, moonSign, risingSign
      )).to.emit(contract, "ChartMinted");

      expect(await contract.hasUserMinted(user1.address)).to.be.true;
      expect(await contract.totalSupply()).to.equal(1);
    });

    it("Should prevent double minting", async function () {
      const enc = await fhevm.createEncryptedInput(contractAddress, user1.address)
        .add16(birthYear).add8(birthMonth).add8(birthDay)
        .add8(birthHour).add8(birthMinute)
        .add32(latitudeEncoded).add32(longitudeEncoded).encrypt();

      await contract.connect(user1).mintBirthChart(
        enc.handles[0], enc.handles[1], enc.handles[2], enc.handles[3],
        enc.handles[4], enc.handles[5], enc.handles[6], enc.inputProof,
        sampleMetadataURI, sunSign, moonSign, risingSign
      );

      const enc2 = await fhevm.createEncryptedInput(contractAddress, user1.address)
        .add16(birthYear).add8(birthMonth).add8(birthDay)
        .add8(birthHour).add8(birthMinute)
        .add32(latitudeEncoded).add32(longitudeEncoded).encrypt();

      await expect(contract.connect(user1).mintBirthChart(
        enc2.handles[0], enc2.handles[1], enc2.handles[2], enc2.handles[3],
        enc2.handles[4], enc2.handles[5], enc2.handles[6], enc2.inputProof,
        sampleMetadataURI, sunSign, moonSign, risingSign
      )).to.be.revertedWith("Already minted a birth chart");
    });
  });

  describe("Reading Data", function () {
    beforeEach(async function () {
      const enc = await fhevm.createEncryptedInput(contractAddress, user1.address)
        .add16(birthYear).add8(birthMonth).add8(birthDay)
        .add8(birthHour).add8(birthMinute)
        .add32(latitudeEncoded).add32(longitudeEncoded).encrypt();

      await contract.connect(user1).mintBirthChart(
        enc.handles[0], enc.handles[1], enc.handles[2], enc.handles[3],
        enc.handles[4], enc.handles[5], enc.handles[6], enc.inputProof,
        sampleMetadataURI, sunSign, moonSign, risingSign
      );
    });

    it("Should return public chart data", async function () {
      const chart = await contract.getBirthChart(1);
      expect(chart.metadataURI).to.equal(sampleMetadataURI);
      expect(chart.sunSign).to.equal(sunSign);
      expect(chart.moonSign).to.equal(moonSign);
      expect(chart.risingSign).to.equal(risingSign);
    });

    it("Should return token by address", async function () {
      expect(await contract.getTokenByAddress(user1.address)).to.equal(1);
      expect(await contract.getTokenByAddress(user2.address)).to.equal(0);
    });
  });

  describe("Metadata Updates", function () {
    beforeEach(async function () {
      const enc = await fhevm.createEncryptedInput(contractAddress, user1.address)
        .add16(birthYear).add8(birthMonth).add8(birthDay)
        .add8(birthHour).add8(birthMinute)
        .add32(latitudeEncoded).add32(longitudeEncoded).encrypt();

      await contract.connect(user1).mintBirthChart(
        enc.handles[0], enc.handles[1], enc.handles[2], enc.handles[3],
        enc.handles[4], enc.handles[5], enc.handles[6], enc.inputProof,
        sampleMetadataURI, sunSign, moonSign, risingSign
      );
    });

    it("Should allow owner to update", async function () {
      const newURI = "ipfs://QmNewHash";
      await contract.connect(user1).updateMetadataURI(1, newURI);
      const chart = await contract.getBirthChart(1);
      expect(chart.metadataURI).to.equal(newURI);
    });

    it("Should prevent non-owner update", async function () {
      await expect(
        contract.connect(user2).updateMetadataURI(1, "ipfs://QmNewHash")
      ).to.be.revertedWith("Not token owner");
    });
  });
});
