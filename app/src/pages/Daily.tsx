import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadProfile } from '../lib/storage'
import { getDailyHoroscope } from '../lib/daily-horoscope'
import type { CosmicProfile } from '../lib/cosmic/profile'

export function Daily() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<CosmicProfile | null>(null)
  const [horoscope, setHoroscope] = useState<ReturnType<typeof getDailyHoroscope> | null>(null)

  useEffect(() => {
    const p = loadProfile()
    if (!p) {
      navigate('/calculate')
      return
    }
    setProfile(p)
    setHoroscope(getDailyHoroscope(p.saju.dominantElement, p.zodiac.name))
  }, [navigate])

  if (!profile || !horoscope) return null

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Daily Cosmic Reading</h1>
        <p className="text-gray-400">{today}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 backdrop-blur border border-purple-500/30">
        <h2 className="text-xl font-bold mb-4 text-center text-white">{profile.cosmicTitle}</h2>
        
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-purple-400 font-medium mb-2">🔮 {profile.saju.dominantElement} Energy</h3>
            <p className="text-gray-200">{horoscope.element}</p>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="text-pink-400 font-medium mb-2">⭐ {profile.zodiac.name} Guidance</h3>
            <p className="text-gray-200">{horoscope.zodiac}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Lucky Number</p>
          <p className="text-3xl font-bold text-yellow-400">{horoscope.luckyNumber}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Lucky Color</p>
          <p className="text-3xl font-bold text-green-400">{horoscope.luckyColor}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/result')}
          className="flex-1 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500 transition text-white"
        >
          View Full Profile
        </button>
        <button
          onClick={() => navigate('/compatibility')}
          className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
        >
          Check Compatibility 💕
        </button>
      </div>
    </div>
  )
}
