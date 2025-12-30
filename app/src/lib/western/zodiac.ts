export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21], end: [7, 22] },
  { name: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23], end: [9, 22] },
  { name: 'Libra', symbol: '♎', element: 'Air', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22], end: [12, 21] },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19], end: [3, 20] }
] as const

export interface ZodiacResult {
  name: string
  symbol: string
  element: string
  start: readonly [number, number]
  end: readonly [number, number]
}

export function calculateZodiac(month: number, day: number): ZodiacResult {
  for (const sign of ZODIAC_SIGNS) {
    const [sm, sd] = sign.start
    const [em, ed] = sign.end
    
    if (sm === em) {
      if (month === sm && day >= sd && day <= ed) return sign
    } else if (sm > em) { // Capricorn case
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign
    }
  }
  return ZODIAC_SIGNS[0] // fallback
}
