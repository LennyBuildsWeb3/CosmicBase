const API_BASE = 'https://gapi.veryapi.io'

export interface VeryUser {
  profileId: string
  profileName: string
  profileImage: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: VeryUser
}

export async function requestVerificationCode(projectId: string, handleId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/request-verification-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, handleId: handleId.replace('@', '') })
  })
  return res.ok
}

export async function getTokens(projectId: string, handleId: string, code: number): Promise<AuthTokens | null> {
  const res = await fetch(`${API_BASE}/auth/get-tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, handleId: handleId.replace('@', ''), verificationCode: code })
  })
  if (!res.ok) return null
  return res.json()
}

export async function refreshTokens(projectId: string, handleId: string, refreshToken: string): Promise<AuthTokens | null> {
  const res = await fetch(`${API_BASE}/auth/refresh-tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, handleId, refreshToken })
  })
  if (!res.ok) return null
  return res.json()
}
