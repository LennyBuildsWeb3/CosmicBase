import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying FHECosmicBaseNFT...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const FHECosmicBaseNFT = await ethers.getContractFactory("FHECosmicBaseNFT");
  const contract = await FHECosmicBaseNFT.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("FHECosmicBaseNFT deployed to:", contractAddress);

  // Initialize encrypted stats
  console.log("Initializing encrypted stats...");
  const initTx = await contract.initializeStats();
  await initTx.wait();
  console.log("Stats initialized successfully!");

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: network.name,
    chainId: network.chainId.toString(),
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save to JSON file
  const filename = `${network.name || "unknown"}-${network.chainId}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to:", filepath);

  // Also save the ABI for frontend use
  const artifact = await ethers.getContractFactory("FHECosmicBaseNFT");
  const abiPath = path.join(deploymentsDir, "FHECosmicBaseNFT.abi.json");
  fs.writeFileSync(abiPath, JSON.stringify(artifact.interface.formatJson(), null, 2));
  console.log("ABI saved to:", abiPath);

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\nDeployment successful!");
    console.log("Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
