import 'dotenv/config';
import { ethers } from 'ethers';
import solc from 'solc';
import fs from 'fs';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error('PRIVATE_KEY required');
  process.exit(1);
}

const source = fs.readFileSync('./contracts/CosmicNFTSimple.sol', 'utf8');

const input = {
  language: 'Solidity',
  sources: { 'CosmicNFTSimple.sol': { content: source } },
  settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
if (output.errors?.some(e => e.severity === 'error')) {
  output.errors.forEach(e => console.error(e.formattedMessage));
  process.exit(1);
}

const contract = output.contracts['CosmicNFTSimple.sol']['CosmicNFT'];
const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

async function deploy() {
  const provider = new ethers.JsonRpcProvider('https://rpc.verylabs.io', 4613, { staticNetwork: true });
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('Deploying from:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance:', ethers.formatEther(balance), 'VERY');
  
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const nft = await factory.deploy();
  await nft.waitForDeployment();
  
  const address = await nft.getAddress();
  console.log('CosmicNFT deployed to:', address);
  console.log('Verify at: https://veryscan.io/address/' + address);
}

deploy().catch(console.error);
