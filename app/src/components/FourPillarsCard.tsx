import type { SajuResult } from '../lib/saju/calculator'

const ELEMENT_STYLES: Record<string, { color: string; bg: string; glow: string }> = {
  Wood: { color: 'text-green-400', bg: 'bg-green-500/20', glow: 'shadow-green-500/30' },
  Fire: { color: 'text-red-400', bg: 'bg-red-500/20', glow: 'shadow-red-500/30' },
  Earth: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', glow: 'shadow-yellow-500/30' },
  Metal: { color: 'text-slate-300', bg: 'bg-slate-500/20', glow: 'shadow-slate-500/30' },
  Water: { color: 'text-blue-400', bg: 'bg-blue-500/20', glow: 'shadow-blue-500/30' }
}

export function FourPillarsCard({ saju }: { saju: SajuResult }) {
  const pillars = [
    { label: '時', sub: 'Hour', ...saju.hour },
    { label: '日', sub: 'Day', ...saju.day },
    { label: '月', sub: 'Month', ...saju.month },
    { label: '年', sub: 'Year', ...saju.year }
  ]

  const dominantStyle = ELEMENT_STYLES[saju.dominantElement] || ELEMENT_STYLES.Fire

  return (
    <div className="card-cosmic rounded-2xl p-6 cosmic-glow">
      <h3 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <span className="text-2xl text-white">四柱</span>
        <span className="text-white">Four Pillars</span>
      </h3>
      
      <div className="grid grid-cols-4 gap-3 text-center">
        {pillars.map((p, i) => {
          const style = ELEMENT_STYLES[p.element] || ELEMENT_STYLES.Fire
          return (
            <div key={i} className={`${style.bg} rounded-xl p-3 border border-white/10`}>
              <div className="text-xs text-gray-400 mb-1">{p.label} {p.sub}</div>
              <div className={`text-3xl font-bold hanzi ${style.color}`} style={{textShadow: `0 0 10px currentColor`}}>
                {p.stem}
              </div>
              <div className={`text-2xl hanzi ${style.color}`} style={{textShadow: `0 0 8px currentColor`}}>
                {p.branch}
              </div>
              <div className="text-xs text-gray-400 mt-1">{p.element}</div>
            </div>
          )
        })}
      </div>
      
      <div className={`mt-6 text-center p-3 rounded-xl ${dominantStyle.bg} border border-white/10`}>
        <span className="text-gray-400">Dominant Element: </span>
        <span className={`font-bold text-lg ${dominantStyle.color}`} style={{textShadow: `0 0 12px currentColor`}}>
          {saju.dominantElement}
        </span>
      </div>
    </div>
  )
}
