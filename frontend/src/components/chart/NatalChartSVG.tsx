'use client'

import { forwardRef } from 'react'
import { ChartCustomization, COLOR_THEMES } from '@/types/customization'

interface NatalChartSVGProps {
  sunSign: string
  moonSign: string
  risingSign: string
  customization: ChartCustomization
  planets?: Record<string, any>
}

export const NatalChartSVG = forwardRef<SVGSVGElement, NatalChartSVGProps>(({
  sunSign,
  moonSign,
  risingSign,
  customization,
  planets
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
      {zodiacSigns.map((sign, index) => {
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
              fontSize="24"
              fill={theme.colors.primary}
              opacity="0.5"
            >
              {zodiacSymbols[sign]}
            </text>
          </g>
        )
      })}

      {/* Center circle */}
      <circle
        cx={center}
        cy={center}
        r={180}
        fill="rgba(0, 0, 0, 0.3)"
        stroke="url(#wheelGradient)"
        strokeWidth="2"
      />

      {/* Display name */}
      <text
        x={center}
        y={center - 60}
        textAnchor="middle"
        fontSize="28"
        fontWeight="bold"
        fill={theme.colors.primary}
      >
        {customization.displayName || 'Natal Chart'}
      </text>

      {/* Main placements */}
      <g>
        {/* Sun */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fontSize="48"
          fill={theme.colors.accent}
        >
          {planetSymbols.Sun}
        </text>
        <text
          x={center}
          y={center + 20}
          textAnchor="middle"
          fontSize="16"
          fill={theme.colors.primary}
        >
          {zodiacSymbols[sunSign]} {sunSign}
        </text>

        {/* Moon */}
        <text
          x={center - 80}
          y={center + 60}
          textAnchor="middle"
          fontSize="32"
          fill={theme.colors.secondary}
        >
          {planetSymbols.Moon}
        </text>
        <text
          x={center - 80}
          y={center + 85}
          textAnchor="middle"
          fontSize="14"
          fill={theme.colors.primary}
        >
          {zodiacSymbols[moonSign]}
        </text>

        {/* Rising (Ascendant) */}
        <text
          x={center + 80}
          y={center + 60}
          textAnchor="middle"
          fontSize="32"
          fill={theme.colors.secondary}
        >
          ↑
        </text>
        <text
          x={center + 80}
          y={center + 85}
          textAnchor="middle"
          fontSize="14"
          fill={theme.colors.primary}
        >
          {zodiacSymbols[risingSign]}
        </text>
      </g>

      {/* Decorative elements */}
      {customization.chartStyle === 'traditional' && (
        <>
          {/* Aspect lines (decorative) */}
          <line
            x1={center - 150}
            y1={center}
            x2={center + 150}
            y2={center}
            stroke={theme.colors.primary}
            strokeWidth="1"
            opacity="0.2"
            strokeDasharray="5,5"
          />
          <line
            x1={center}
            y1={center - 150}
            x2={center}
            y2={center + 150}
            stroke={theme.colors.primary}
            strokeWidth="1"
            opacity="0.2"
            strokeDasharray="5,5"
          />
        </>
      )}

      {/* Footer */}
      <text
        x={center}
        y={size - 40}
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
