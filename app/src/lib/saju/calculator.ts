import { STEMS, BRANCHES, STEM_ELEMENT, BRANCH_ELEMENT, HOUR_BRANCH, ELEMENTS } from './constants'

export interface Pillar {
  stem: string
  branch: string
  element: string
}

export interface SajuResult {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar
  dominantElement: string
  elementCounts: Record<string, number>
}

// Calculate Year Pillar
function getYearPillar(year: number): Pillar {
  const stemIdx = (year - 4) % 10
  const branchIdx = (year - 4) % 12
  const stem = STEMS[stemIdx]
  return { stem, branch: BRANCHES[branchIdx], element: STEM_ELEMENT[stem] }
}

// Calculate Month Pillar
function getMonthPillar(year: number, month: number): Pillar {
  const yearStemIdx = (year - 4) % 10
  const monthStemStart = (yearStemIdx % 5) * 2
  const stemIdx = (monthStemStart + month - 1) % 10
  const branchIdx = (month + 1) % 12
  const stem = STEMS[stemIdx]
  return { stem, branch: BRANCHES[branchIdx], element: STEM_ELEMENT[stem] }
}

// Calculate Day Pillar (simplified algorithm)
function getDayPillar(year: number, month: number, day: number): Pillar {
  const baseDate = new Date(1900, 0, 31)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000)
  const stemIdx = diffDays % 10
  const branchIdx = diffDays % 12
  const stem = STEMS[stemIdx >= 0 ? stemIdx : stemIdx + 10]
  return { stem, branch: BRANCHES[branchIdx >= 0 ? branchIdx : branchIdx + 12], element: STEM_ELEMENT[stem] }
}

// Calculate Hour Pillar
function getHourPillar(dayStem: string, hour: number): Pillar {
  const dayStemIdx = STEMS.indexOf(dayStem as typeof STEMS[number])
  const hourBranchIdx = HOUR_BRANCH[hour] ?? 0
  const hourStemStart = (dayStemIdx % 5) * 2
  const stemIdx = (hourStemStart + hourBranchIdx) % 10
  const stem = STEMS[stemIdx]
  return { stem, branch: BRANCHES[hourBranchIdx], element: STEM_ELEMENT[stem] }
}

// Count elements and find dominant
function analyzeElements(pillars: Pillar[]): { counts: Record<string, number>, dominant: string } {
  const counts: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 }
  pillars.forEach(p => {
    counts[STEM_ELEMENT[p.stem]]++
    counts[BRANCH_ELEMENT[p.branch]]++
  })
  const dominant = ELEMENTS.reduce((a, b) => counts[a] >= counts[b] ? a : b)
  return { counts, dominant }
}

export function calculateSaju(year: number, month: number, day: number, hour: number): SajuResult {
  const yearPillar = getYearPillar(year)
  const monthPillar = getMonthPillar(year, month)
  const dayPillar = getDayPillar(year, month, day)
  const hourPillar = getHourPillar(dayPillar.stem, hour)
  
  const { counts, dominant } = analyzeElements([yearPillar, monthPillar, dayPillar, hourPillar])
  
  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dominantElement: dominant,
    elementCounts: counts
  }
}
