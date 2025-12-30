import { JsonRpcSigner, Contract } from 'ethers'
import { VERY_CHAIN } from './wallet'

// Minimal ERC721 ABI for minting
const NFT_ABI = [
  'function mint(address to, string memory tokenURI) public returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)'
]

// TODO: Deploy contract and update this address
export const NFT_CONTRACT_ADDRESS = '0xbE6962010697f1B914166209a0E5B18A56bf5708'

export async function mintCosmicNFT(
  signer: JsonRpcSigner,
  toAddress: string,
  metadataURI: string
): Promise<string> {
  const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer)
  const tx = await contract.mint(toAddress, metadataURI)
  const receipt = await tx.wait()
  return receipt.hash
}

export function getExplorerTxUrl(txHash: string): string {
  return `${VERY_CHAIN.explorerUrl}/tx/${txHash}`
}
