import { BrowserProvider, JsonRpcSigner } from 'ethers'

export const VERY_CHAIN = {
  chainId: 4613,
  chainIdHex: '0x1205',
  name: 'Very Chain',
  currency: { name: 'VERY', symbol: 'VERY', decimals: 18 },
  rpcUrl: 'https://rpc.verylabs.io',
  explorerUrl: 'https://veryscan.io'
}

export async function getSigner(): Promise<JsonRpcSigner> {
  const provider = new BrowserProvider(window.ethereum!)
  return provider.getSigner()
}

export async function connectWallet(): Promise<{ address: string; signer: JsonRpcSigner } | null> {
  if (!window.ethereum) {
    alert('Please install MetaMask')
    return null
  }
  
  const provider = new BrowserProvider(window.ethereum)
  
  // Request account access
  await provider.send('eth_requestAccounts', [])
  
  // Switch to Very Chain
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: VERY_CHAIN.chainIdHex }]
    })
  } catch (e: unknown) {
    if ((e as { code: number }).code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: VERY_CHAIN.chainIdHex,
          chainName: VERY_CHAIN.name,
          nativeCurrency: VERY_CHAIN.currency,
          rpcUrls: [VERY_CHAIN.rpcUrl],
          blockExplorerUrls: [VERY_CHAIN.explorerUrl]
        }]
      })
    }
  }
  
  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  return { address, signer }
}

declare global {
  interface Window { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }
}
