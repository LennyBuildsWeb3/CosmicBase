const hre = require("hardhat");

async function main() {
  console.log("Deploying CosmicBaseNFT contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const CosmicBaseNFT = await hre.ethers.getContractFactory("CosmicBaseNFT");
  const cosmicBaseNFT = await CosmicBaseNFT.deploy();

  await cosmicBaseNFT.waitForDeployment();

  const contractAddress = await cosmicBaseNFT.getAddress();
  console.log("CosmicBaseNFT deployed to:", contractAddress);

  // Wait for a few block confirmations
  console.log("\nWaiting for block confirmations...");
  await cosmicBaseNFT.deploymentTransaction().wait(5);

  console.log("\nContract Details:");
  console.log("- Name:", await cosmicBaseNFT.name());
  console.log("- Symbol:", await cosmicBaseNFT.symbol());
  console.log("- Owner:", await cosmicBaseNFT.owner());

  console.log("\n✅ Deployment successful!");
  console.log("\nNext steps:");
  console.log("1. Verify contract on Basescan:");
  console.log(`   npx hardhat verify --network baseSepolia ${contractAddress}`);
  console.log("\n2. Save this contract address for frontend integration");
  console.log("\n3. Test by minting a birth chart NFT");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contract: "CosmicBaseNFT",
    address: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`\nDeployment info saved to deployments/${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
