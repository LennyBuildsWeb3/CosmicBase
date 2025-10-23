export type ColorTheme = 'cosmic-purple' | 'galaxy-blue' | 'mystic-pink' | 'stellar-gold' | 'dark-matter'

export type ChartStyle = 'traditional' | 'modern' | 'minimal'

export type ZodiacArtStyle = 'detailed' | 'minimal' | 'geometric'

export interface ChartCustomization {
  displayName: string
  colorTheme: ColorTheme
  chartStyle: ChartStyle
  zodiacArtStyle: ZodiacArtStyle
}

export const COLOR_THEMES: Record<ColorTheme, { name: string; colors: { primary: string; secondary: string; accent: string } }> = {
  'cosmic-purple': {
    name: 'Cosmic Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#c084fc',
      accent: '#e879f9'
    }
  },
  'galaxy-blue': {
    name: 'Galaxy Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93c5fd'
    }
  },
  'mystic-pink': {
    name: 'Mystic Pink',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#f9a8d4'
    }
  },
  'stellar-gold': {
    name: 'Stellar Gold',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#fcd34d'
    }
  },
  'dark-matter': {
    name: 'Dark Matter',
    colors: {
      primary: '#6366f1',
      secondary: '#818cf8',
      accent: '#a5b4fc'
    }
  }
}

export const CHART_STYLES: Record<ChartStyle, { name: string; description: string }> = {
  traditional: {
    name: 'Traditional',
    description: 'Classic astrological wheel with houses and aspects'
  },
  modern: {
    name: 'Modern',
    description: 'Clean and minimalist design with focus on key elements'
  },
  minimal: {
    name: 'Minimal',
    description: 'Simple and elegant with essential information only'
  }
}

export const ZODIAC_ART_STYLES: Record<ZodiacArtStyle, { name: string; description: string }> = {
  detailed: {
    name: 'Detailed',
    description: 'Rich illustrations with intricate zodiac symbols'
  },
  minimal: {
    name: 'Minimal',
    description: 'Simple and clean zodiac glyphs'
  },
  geometric: {
    name: 'Geometric',
    description: 'Modern geometric interpretations'
  }
}
