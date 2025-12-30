const ELEMENT_COMPAT: Record<string, Record<string, number>> = {
  Wood: { Wood: 70, Fire: 90, Earth: 40, Metal: 30, Water: 85 },
  Fire: { Wood: 90, Fire: 60, Earth: 85, Metal: 40, Water: 30 },
  Earth: { Wood: 40, Fire: 85, Earth: 70, Metal: 90, Water: 50 },
  Metal: { Wood: 30, Fire: 40, Earth: 90, Metal: 70, Water: 85 },
  Water: { Wood: 85, Fire: 30, Earth: 50, Metal: 85, Water: 70 }
}

const ZODIAC_COMPAT: Record<string, string[]> = {
  Aries: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
  Taurus: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
  Gemini: ['Libra', 'Aquarius', 'Aries', 'Leo'],
  Cancer: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
  Leo: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
  Virgo: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
  Libra: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
  Scorpio: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
  Sagittarius: ['Aries', 'Leo', 'Libra', 'Aquarius'],
  Capricorn: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
  Aquarius: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
  Pisces: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn']
}

export interface CompatibilityResult {
  score: number
  elementScore: number
  zodiacScore: number
  description: string
  strengths: string[]
  challenges: string[]
}

export function calculateCompatibility(
  person1: { element: string; zodiac: string },
  person2: { element: string; zodiac: string }
): CompatibilityResult {
  const elementScore = ELEMENT_COMPAT[person1.element]?.[person2.element] || 50
  
  const zodiacMatches = ZODIAC_COMPAT[person1.zodiac] || []
  const zodiacScore = zodiacMatches.includes(person2.zodiac) ? 85 : 
    person1.zodiac === person2.zodiac ? 70 : 50
  
  const score = Math.round((elementScore * 0.5) + (zodiacScore * 0.5))
  
  const strengths: string[] = []
  const challenges: string[] = []
  
  if (elementScore >= 80) strengths.push(`${person1.element} and ${person2.element} create powerful synergy`)
  if (zodiacScore >= 80) strengths.push(`${person1.zodiac} and ${person2.zodiac} naturally understand each other`)
  if (elementScore <= 40) challenges.push(`${person1.element} and ${person2.element} may clash - patience needed`)
  if (zodiacScore <= 50 && person1.zodiac !== person2.zodiac) challenges.push(`Different communication styles between ${person1.zodiac} and ${person2.zodiac}`)
  
  if (strengths.length === 0) strengths.push('Balance of different energies can create growth')
  if (challenges.length === 0) challenges.push('Maintain individual space for harmony')
  
  let description = ''
  if (score >= 80) description = '🔥 Cosmic Soulmates! Exceptional compatibility.'
  else if (score >= 65) description = '✨ Strong Connection! Great potential together.'
  else if (score >= 50) description = '🌙 Balanced Match. Work together for harmony.'
  else description = '🌊 Challenging but Growth-Oriented. Opposites can attract!'
  
  return { score, elementScore, zodiacScore, description, strengths, challenges }
}
