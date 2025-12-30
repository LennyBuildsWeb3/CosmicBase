import { Link } from 'react-router-dom'
import { loadProfile } from '../lib/storage'

export function Home() {
  const hasProfile = !!loadProfile()

  return (
    <div className="max-w-2xl mx-auto text-center py-8 space-y-8">
      <div className="space-y-4">
        <div className="text-6xl mb-4">☯</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
          CosmicBase
        </h1>
        <p className="text-xl text-purple-200">Eastern Saju meets Western Astrology</p>
        <p className="text-gray-400 max-w-md mx-auto">
          Discover your cosmic profile combining Korean Four Pillars (四柱) with Western Zodiac on Web3
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 py-6">
        {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((el, i) => {
          const colors = ['text-green-400', 'text-red-400', 'text-yellow-400', 'text-slate-300', 'text-blue-400']
          const symbols = ['🌳', '🔥', '🌍', '⚔️', '💧']
          return (
            <div key={el} className="card-cosmic rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{symbols[i]}</div>
              <div className={`text-xs ${colors[i]}`}>{el}</div>
            </div>
          )
        })}
      </div>

      <div className="space-y-4">
        {hasProfile ? (
          <>
            <Link to="/daily"
              className="block w-full py-4 btn-cosmic rounded-xl font-bold text-lg text-white">
              ☀️ Today's Cosmic Reading
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/result"
                className="block py-3 card-cosmic rounded-lg hover:border-purple-500 transition text-purple-300">
                View Profile
              </Link>
              <Link to="/compatibility"
                className="block py-3 card-cosmic rounded-lg hover:border-pink-500 transition text-pink-300">
                💕 Compatibility
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/login"
              className="block w-full py-4 btn-cosmic rounded-xl font-bold text-lg text-white">
              ✨ Start with VeryChat
            </Link>
            <Link to="/calculate"
              className="block w-full py-3 card-cosmic rounded-lg hover:border-purple-500 transition text-gray-300">
              Try without login →
            </Link>
          </>
        )}
      </div>

      <p className="text-xs text-gray-600">
        Built on Very Network • Privacy-first • Your data stays on your device
      </p>
    </div>
  )
}
