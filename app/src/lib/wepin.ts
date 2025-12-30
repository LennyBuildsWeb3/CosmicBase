import { WepinSDK } from '@wepin/sdk-js'

let wepinInstance: WepinSDK | null = null

export async function initWepin(): Promise<WepinSDK> {
  if (wepinInstance) return wepinInstance
  
  const wepin = new WepinSDK({
    appId: import.meta.env.VITE_WEPIN_APP_ID,
    appKey: import.meta.env.VITE_WEPIN_APP_KEY,
  })
  
  await wepin.init({ defaultLanguage: 'en' })
  wepinInstance = wepin
  return wepin
}

export async function loginWithWepin(): Promise<{ address: string } | null> {
  const wepin = await initWepin()
  
  const loginResult = await wepin.loginWithUI()
  if (!loginResult) return null
  
  const accounts = await wepin.getAccounts()
  const veryAccount = accounts.find(a => a.network === 'evmeth-verychain') || accounts[0]
  
  if (!veryAccount) return null
  return { address: veryAccount.address }
}

export async function openWepinWidget(): Promise<void> {
  const wepin = await initWepin()
  await wepin.openWidget()
}

export function getWepinInstance(): WepinSDK | null {
  return wepinInstance
}
