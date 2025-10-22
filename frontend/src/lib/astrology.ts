/**
 * Astrology calculation utilities
 * Using circular-natal-horoscope-js library
 */

import { Origin, Horoscope } from 'circular-natal-horoscope-js'
import { keccak256, toHex } from 'viem'

export interface BirthData {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  latitude: number
  longitude: number
}

export interface CalculatedChart {
  sunSign: number // 1-12
  moonSign: number // 1-12
  risingSign: number // 1-12
  birthDataHash: `0x${string}`
  fullChart: any
}

// Map zodiac signs to numbers (1-12)
const signToNumber: Record<string, number> = {
  'aries': 1,
  'taurus': 2,
  'gemini': 3,
  'cancer': 4,
  'leo': 5,
  'virgo': 6,
  'libra': 7,
  'scorpio': 8,
  'sagittarius': 9,
  'capricorn': 10,
  'aquarius': 11,
  'pisces': 12
}

/**
 * Calculate birth chart from birth data
 */
export function calculateBirthChart(birthData: BirthData): CalculatedChart {
  try {
    const origin: Origin = new Origin({
      year: birthData.year,
      month: birthData.month - 1, // Library uses 0-indexed months
      date: birthData.day,
      hour: birthData.hour,
      minute: birthData.minute,
      latitude: birthData.latitude,
      longitude: birthData.longitude
    })

    const horoscope = new Horoscope({
      origin,
      houseSystem: 'placidus',
      zodiac: 'tropical',
      aspectPoints: ['bodies', 'points', 'angles'],
      aspectWithPoints: ['bodies', 'points', 'angles'],
      aspectTypes: ['major', 'minor'],
      customOrbs: {},
      language: 'en'
    })

    // Get celestial bodies
    const celestialBodies = horoscope.CelestialBodies
    const celestialPoints = horoscope.CelestialPoints

    // Extract Sun, Moon, and Ascendant signs
    const sun = celestialBodies.all.find((b: any) => b.label === 'Sun')
    const moon = celestialBodies.all.find((b: any) => b.label === 'Moon')
    const ascendant = celestialPoints.all.find((p: any) => p.label === 'Ascendant')

    const sunSign = sun ? signToNumber[sun.Sign.label.toLowerCase()] || 1 : 1
    const moonSign = moon ? signToNumber[moon.Sign.label.toLowerCase()] || 1 : 1
    const risingSign = ascendant ? signToNumber[ascendant.Sign.label.toLowerCase()] || 1 : 1

    // Create privacy-preserving hash of birth data
    const birthDataString = `${birthData.year}-${birthData.month}-${birthData.day}-${birthData.hour}-${birthData.minute}-${birthData.latitude}-${birthData.longitude}`
    const birthDataHash = keccak256(toHex(birthDataString))

    return {
      sunSign,
      moonSign,
      risingSign,
      birthDataHash,
      fullChart: {
        celestialBodies: celestialBodies.all,
        celestialPoints: celestialPoints.all,
        houses: horoscope.Houses.all,
        aspects: horoscope.Aspects.all
      }
    }
  } catch (error) {
    console.error('Birth chart calculation error:', error)
    throw new Error('Failed to calculate birth chart')
  }
}

/**
 * Get zodiac sign name from number
 */
export function getSignName(signNumber: number): string {
  const signs = [
    '', 'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]
  return signs[signNumber] || ''
}

/**
 * Get zodiac sign emoji
 */
export function getSignEmoji(signNumber: number): string {
  const emojis = [
    '', '♈', '♉', '♊', '♋',
    '♌', '♍', '♎', '♏',
    '♐', '♑', '♒', '♓'
  ]
  return emojis[signNumber] || ''
}

/**
 * Validate birth data
 */
export function validateBirthData(data: BirthData): string | null {
  if (data.year < 1900 || data.year > new Date().getFullYear()) {
    return 'Invalid year'
  }
  if (data.month < 1 || data.month > 12) {
    return 'Invalid month'
  }
  if (data.day < 1 || data.day > 31) {
    return 'Invalid day'
  }
  if (data.hour < 0 || data.hour > 23) {
    return 'Invalid hour'
  }
  if (data.minute < 0 || data.minute > 59) {
    return 'Invalid minute'
  }
  if (data.latitude < -90 || data.latitude > 90) {
    return 'Invalid latitude'
  }
  if (data.longitude < -180 || data.longitude > 180) {
    return 'Invalid longitude'
  }
  return null
}
