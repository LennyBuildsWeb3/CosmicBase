import hre from "hardhat";

async function main() {
  const CosmicNFT = await hre.ethers.getContractFactory("CosmicNFT");
  const nft = await CosmicNFT.deploy();
  await nft.waitForDeployment();
  console.log("CosmicNFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
