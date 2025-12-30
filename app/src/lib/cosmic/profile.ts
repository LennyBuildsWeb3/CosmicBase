import type { SajuResult } from '../saju/calculator'
import type { ZodiacResult } from '../western/zodiac'

export interface CosmicProfile {
  saju: SajuResult
  zodiac: ZodiacResult
  cosmicTitle: string
  description: string
}

const ELEMENT_TRAITS: Record<string, string> = {
  Wood: 'growth-oriented and creative',
  Fire: 'passionate and dynamic',
  Earth: 'stable and nurturing',
  Metal: 'determined and precise',
  Water: 'intuitive and adaptable'
}

const ZODIAC_TRAITS: Record<string, string> = {
  Aries: 'bold leadership',
  Taurus: 'steadfast determination',
  Gemini: 'versatile communication',
  Cancer: 'emotional depth',
  Leo: 'radiant confidence',
  Virgo: 'analytical precision',
  Libra: 'harmonious balance',
  Scorpio: 'intense transformation',
  Sagittarius: 'adventurous spirit',
  Capricorn: 'ambitious discipline',
  Aquarius: 'innovative vision',
  Pisces: 'empathic intuition'
}

export function createCosmicProfile(saju: SajuResult, zodiac: ZodiacResult): CosmicProfile {
  const sajuElement = saju.dominantElement
  const cosmicTitle = `Cosmic ${sajuElement} ${zodiac.name}`
  
  const description = `You are ${ELEMENT_TRAITS[sajuElement]} with ${ZODIAC_TRAITS[zodiac.name]}. ` +
    `Your ${sajuElement} energy from Eastern wisdom combines with ${zodiac.element} ${zodiac.name} traits ` +
    `to create a unique cosmic signature.`
  
  return { saju, zodiac, cosmicTitle, description }
}
