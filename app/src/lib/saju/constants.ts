// Heavenly Stems (천간)
export const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const
export const STEM_NAMES = ['갑','을','병','정','무','기','경','신','임','계'] as const

// Earthly Branches (지지)
export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const
export const BRANCH_NAMES = ['자','축','인','묘','진','사','오','미','신','유','술','해'] as const

// Five Elements (오행)
export const ELEMENTS = ['Wood','Fire','Earth','Metal','Water'] as const
export const ELEMENT_KOREAN = ['목','화','토','금','수'] as const

// Stem to Element mapping
export const STEM_ELEMENT: Record<string, typeof ELEMENTS[number]> = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
}

// Branch to Element mapping
export const BRANCH_ELEMENT: Record<string, typeof ELEMENTS[number]> = {
  '寅': 'Wood', '卯': 'Wood',
  '巳': 'Fire', '午': 'Fire',
  '辰': 'Earth', '未': 'Earth', '戌': 'Earth', '丑': 'Earth',
  '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
}

// Hour to Branch mapping (2-hour periods)
export const HOUR_BRANCH: Record<number, number> = {
  23: 0, 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
  7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7,
  15: 8, 16: 8, 17: 9, 18: 9, 19: 10, 20: 10, 21: 11, 22: 11
}
