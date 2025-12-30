import type { CosmicProfile } from './cosmic/profile'

const STORAGE_KEY = 'cosmicbase_profile'
const AUTH_KEY = 'cosmicbase_auth'

export function saveProfile(profile: CosmicProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function loadProfile(): CosmicProfile | null {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

export function saveAuth(data: { accessToken: string; refreshToken: string; handleId: string }): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
}

export function loadAuth(): { accessToken: string; refreshToken: string; handleId: string } | null {
  const data = localStorage.getItem(AUTH_KEY)
  return data ? JSON.parse(data) : null
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY)
}
