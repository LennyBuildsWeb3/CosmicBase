'use client'

import { forwardRef } from 'react'
import { ChartCustomization, COLOR_THEMES } from '@/types/customization'

interface NatalChartSVGProps {
  sunSign: string
  moonSign: string
  risingSign: string
  customization: ChartCustomization
  planets?: any
  houses?: any[]
  aspects?: any[]
}

export const NatalChartSVG = forwardRef<SVGSVGElement, NatalChartSVGProps>(({
  sunSign,
  moonSign,
  risingSign,
  customization,
  planets,
  houses,
  aspects
}, ref) => {
  const theme = COLOR_THEMES[customization.colorTheme]
  const size = 800
  const center = size / 2
  const outerRadius = 360
  const innerRadius = 280

  // Zodiac sign symbols (Unicode)
  const zodiacSymbols: Record<string, string> = {
    'Aries': '♈',
    'Taurus': '♉',
    'Gemini': '♊',
    'Cancer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Scorpio': '♏',
    'Sagittarius': '♐',
    'Capricorn': '♑',
    'Aquarius': '♒',
    'Pisces': '♓'
  }

  // Planet symbols
  const planetSymbols: Record<string, string> = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇'
  }

  // Calculate position on circle
  const getPosition = (angle: number, radius: number) => {
    const rad = (angle - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    }
  }

  // Get planet positions from the chart data
  const getPlanetPositions = () => {
    if (!planets) return []

    // Handle both array and object with 'all' property
    const planetArray = Array.isArray(planets) ? planets : planets.all || []

    // Filter out North Node and South Node
    const filteredPlanets = planetArray.filter((planet: any) => {
      const label = planet.label
      return label !== 'North Node' && label !== 'South Node' && label !== 'NNode' && label !== 'SNode'
    })

    return filteredPlanets.map((planet: any) => ({
      name: planet.label,
      symbol: planetSymbols[planet.label] || planet.label[0],
      degree: planet.ChartPosition.Ecliptic.DecimalDegrees,
      sign: planet.Sign.label,
      color: getPlanetColor(planet.label)
    }))
  }

  // Get house cusps
  const getHouseCusps = () => {
    if (!houses || houses.length === 0) return []

    return houses.map((house: any, index: number) => ({
      number: index + 1,
      degree: house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees
    }))
  }

  // Get planet color based on traditional astrology
  const getPlanetColor = (planetName: string): string => {
    const colors: Record<string, string> = {
      'Sun': '#FFD700',
      'Moon': '#E0E0E0',
      'Mercury': '#87CEEB',
      'Venus': '#FFB6C1',
      'Mars': '#FF4500',
      'Jupiter': '#DDA0DD',
      'Saturn': '#8B7355',
      'Uranus': '#40E0D0',
      'Neptune': '#9370DB',
      'Pluto': '#8B4513'
    }
    return colors[planetName] || theme.colors.primary
  }

  // Get aspect color and style
  const getAspectStyle = (aspectType: string) => {
    const styles: Record<string, { color: string; width: number; dash: string; opacity: number }> = {
      'conjunction': { color: '#FFD700', width: 2, dash: '', opacity: 0.6 },
      'opposition': { color: '#FF4500', width: 2, dash: '', opacity: 0.5 },
      'trine': { color: '#00FF00', width: 1.5, dash: '', opacity: 0.4 },
      'square': { color: '#FF0000', width: 1.5, dash: '', opacity: 0.4 },
      'sextile': { color: '#00BFFF', width: 1, dash: '3,3', opacity: 0.3 },
      'quincunx': { color: '#9370DB', width: 1, dash: '2,2', opacity: 0.2 }
    }
    return styles[aspectType.toLowerCase()] || { color: theme.colors.primary, width: 0.5, dash: '1,1', opacity: 0.15 }
  }

  const planetPositions = getPlanetPositions()
  const houseCusps = getHouseCusps()

  // Draw zodiac wheel
  const zodiacSigns = Object.keys(zodiacSymbols)
  const anglePerSign = 360 / 12

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="url(#bgGradient)"
        opacity="0.1"
      />

      {/* Gradient definitions */}
      <defs>
        <radialGradient id="bgGradient">
          <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={theme.colors.secondary} stopOpacity="0.05" />
        </radialGradient>

        <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.colors.primary} />
          <stop offset="50%" stopColor={theme.colors.secondary} />
          <stop offset="100%" stopColor={theme.colors.accent} />
        </linearGradient>
      </defs>

      {/* Outer wheel ring */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke="url(#wheelGradient)"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* Inner wheel ring */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="url(#wheelGradient)"
        strokeWidth="2"
        opacity="0.4"
      />

      {/* Zodiac divisions and symbols */}
      {zodiacSigns.map((sign: string, index: number) => {
        const startAngle = index * anglePerSign
        const middleAngle = startAngle + anglePerSign / 2
        const symbolPos = getPosition(middleAngle, (outerRadius + innerRadius) / 2)

        // Division line
        const lineStart = getPosition(startAngle, innerRadius)
        const lineEnd = getPosition(startAngle, outerRadius)

        return (
          <g key={sign}>
            {/* Division line */}
            <line
              x1={lineStart.x}
              y1={lineStart.y}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke={theme.colors.primary}
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Zodiac symbol */}
            <text
              x={symbolPos.x}
              y={symbolPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="32"
              fill={theme.colors.primary}
              opacity="0.7"
            >
              {zodiacSymbols[sign]}
            </text>
          </g>
        )
      })}

      {/* House divisions */}
      {houseCusps.length > 0 && houseCusps.map((house: any, index: number) => {
        const houseStart = getPosition(house.degree, innerRadius - 10)
        const houseEnd = getPosition(house.degree, 120)
        const houseNumberPos = getPosition(house.degree + 15, 220) // Offset for house number

        return (
          <g key={`house-${index}`}>
            {/* House division line */}
            <line
              x1={houseStart.x}
              y1={houseStart.y}
              x2={houseEnd.x}
              y2={houseEnd.y}
              stroke={theme.colors.accent}
              strokeWidth="2"
              opacity="0.8"
            />
            {/* House number */}
            <text
              x={houseNumberPos.x}
              y={houseNumberPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="18"
              fill={theme.colors.accent}
              opacity="0.9"
              fontWeight="bold"
            >
              {house.number}
            </text>
          </g>
        )
      })}

      {/* Aspect lines - Draw first so they're behind planets */}
      {aspects && aspects.length > 0 && aspects.map((aspect: any, index: number) => {
        // Check if aspect has the required properties
        if (!aspect.point1 || !aspect.point2 || !aspect.point1.label || !aspect.point2.label) {
          return null
        }

        // Find the positions of the two planets involved in the aspect
        const planet1Pos = planetPositions.find((p: any) => p.name === aspect.point1.label)
        const planet2Pos = planetPositions.find((p: any) => p.name === aspect.point2.label)

        if (!planet1Pos || !planet2Pos) return null

        const pos1 = getPosition(planet1Pos.degree, 230)
        const pos2 = getPosition(planet2Pos.degree, 230)
        const style = getAspectStyle(aspect.aspectLevel || aspect.type || '')

        return (
          <line
            key={`aspect-${index}`}
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={style.color}
            strokeWidth={style.width}
            strokeDasharray={style.dash}
            opacity={style.opacity}
          />
        )
      })}

      {/* Inner circle for cleaner look */}
      <circle
        cx={center}
        cy={center}
        r={110}
        fill="rgba(0, 0, 0, 0.5)"
        stroke="url(#wheelGradient)"
        strokeWidth="2"
      />

      {/* Display name */}
      <text
        x={center}
        y={center - 40}
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        fill={theme.colors.primary}
      >
        {customization.displayName || 'Natal Chart'}
      </text>

      {/* Main placements summary in center */}
      <g>
        {/* Sun */}
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          fontSize="20"
          fill="#FFD700"
        >
          {planetSymbols.Sun} {zodiacSymbols[sunSign]}
        </text>

        {/* Moon */}
        <text
          x={center}
          y={center + 20}
          textAnchor="middle"
          fontSize="18"
          fill="#E0E0E0"
        >
          {planetSymbols.Moon} {zodiacSymbols[moonSign]}
        </text>

        {/* Rising */}
        <text
          x={center}
          y={center + 40}
          textAnchor="middle"
          fontSize="18"
          fill={theme.colors.secondary}
        >
          ↑ {zodiacSymbols[risingSign]}
        </text>
      </g>

      {/* Planet positions on the wheel */}
      {planetPositions.map((planet: any, index: number) => {
        const planetRadius = 250
        const planetPos = getPosition(planet.degree, planetRadius)

        // Add a small connecting line to the zodiac wheel
        const lineStart = getPosition(planet.degree, innerRadius)
        const lineEnd = getPosition(planet.degree, planetRadius - 20)

        return (
          <g key={`planet-${index}`}>
            {/* Connection line */}
            <line
              x1={lineStart.x}
              y1={lineStart.y}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke={planet.color}
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Planet symbol */}
            <circle
              cx={planetPos.x}
              cy={planetPos.y}
              r="18"
              fill="rgba(0, 0, 0, 0.7)"
              stroke={planet.color}
              strokeWidth="2"
            />
            <text
              x={planetPos.x}
              y={planetPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fill={planet.color}
              fontWeight="bold"
            >
              {planet.symbol}
            </text>

            {/* Degree marker */}
            <text
              x={planetPos.x}
              y={planetPos.y + 32}
              textAnchor="middle"
              fontSize="10"
              fill={planet.color}
              opacity="0.8"
            >
              {Math.floor(planet.degree % 30)}°
            </text>
          </g>
        )
      })}

      {/* Footer */}
      <text
        x={center}
        y={size - 20}
        textAnchor="middle"
        fontSize="14"
        fill={theme.colors.primary}
        opacity="0.7"
      >
        CosmicBase • {customization.colorTheme.replace('-', ' ').toUpperCase()}
      </text>
    </svg>
  )
})

NatalChartSVG.displayName = 'NatalChartSVG'
