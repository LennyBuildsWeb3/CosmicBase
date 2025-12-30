import type { ZodiacResult } from '../lib/western/zodiac'

const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
}

const ELEMENT_COLORS: Record<string, { text: string; bg: string }> = {
  Fire: { text: 'text-orange-400', bg: 'from-orange-500/30 to-red-500/30' },
  Earth: { text: 'text-amber-400', bg: 'from-amber-500/30 to-yellow-600/30' },
  Air: { text: 'text-cyan-400', bg: 'from-cyan-500/30 to-blue-400/30' },
  Water: { text: 'text-blue-400', bg: 'from-blue-500/30 to-indigo-500/30' }
}

export function ZodiacCard({ zodiac }: { zodiac: ZodiacResult }) {
  const symbol = ZODIAC_SYMBOLS[zodiac.name] || '★'
  const colors = ELEMENT_COLORS[zodiac.element] || ELEMENT_COLORS.Fire

  return (
    <div className="card-cosmic rounded-2xl p-6 cosmic-glow">
      <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <span className="text-2xl">⭐</span>
        <span className="text-pink-300">Western Zodiac</span>
      </h3>
      
      <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 text-center border border-white/10`}>
        <div 
          className={`text-7xl mb-4 zodiac-symbol ${colors.text}`}
          style={{ textShadow: `0 0 20px currentColor` }}
        >
          {symbol}
        </div>
        <div className="text-2xl font-bold text-white mb-1">{zodiac.name}</div>
        <div className={`text-sm ${colors.text}`}>{zodiac.element} Sign</div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-gray-400">Dates</div>
          <div className="text-white">{zodiac.start[0]}/{zodiac.start[1]} - {zodiac.end[0]}/{zodiac.end[1]}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-gray-400">Element</div>
          <div className={colors.text}>{zodiac.element}</div>
        </div>
      </div>
    </div>
  )
}
