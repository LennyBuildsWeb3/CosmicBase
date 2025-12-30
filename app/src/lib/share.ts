export function generateShareText(profile: { cosmicTitle: string; description: string; element: string; zodiac: string }): string {
  return `✨ My Cosmic Profile: ${profile.cosmicTitle}\n\n🔮 ${profile.element} Element + ${profile.zodiac}\n\n${profile.description}\n\nDiscover yours at CosmicBase! 🌟`
}

export function shareToTwitter(text: string, url: string): void {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, '_blank')
}

export function shareToTelegram(text: string, url: string): void {
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  window.open(telegramUrl, '_blank')
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function generateShareImage(profile: { cosmicTitle: string; element: string; zodiac: string }): string {
  // Returns a data URL for sharing - simplified version
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 400
  const ctx = canvas.getContext('2d')!
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 600, 400)
  gradient.addColorStop(0, '#1a1a2e')
  gradient.addColorStop(1, '#4a1a6b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 600, 400)
  
  // Text
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(profile.cosmicTitle, 300, 150)
  
  ctx.font = '24px Arial'
  ctx.fillStyle = '#a78bfa'
  ctx.fillText(`${profile.element} Element • ${profile.zodiac}`, 300, 200)
  
  ctx.font = '18px Arial'
  ctx.fillStyle = '#9ca3af'
  ctx.fillText('CosmicBase - Eastern Saju meets Western Astrology', 300, 350)
  
  return canvas.toDataURL('image/png')
}
