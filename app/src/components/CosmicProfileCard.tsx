import type { CosmicProfile } from '../lib/cosmic/profile'

const ELEMENT_GRADIENTS: Record<string, string> = {
  Wood: 'from-green-600 to-emerald-400',
  Fire: 'from-red-600 to-orange-400',
  Earth: 'from-yellow-600 to-amber-400',
  Metal: 'from-slate-500 to-gray-300',
  Water: 'from-blue-600 to-cyan-400'
}

export function CosmicProfileCard({ profile }: { profile: CosmicProfile }) {
  const gradient = ELEMENT_GRADIENTS[profile.saju.dominantElement] || ELEMENT_GRADIENTS.Fire

  return (
    <div className="card-cosmic rounded-2xl p-8 cosmic-glow text-center">
      <div className="mb-4">
        <span className="text-5xl">✨</span>
      </div>
      
      <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {profile.cosmicTitle}
      </h2>
      
      <p className="text-gray-300 mb-6 leading-relaxed max-w-lg mx-auto">
        {profile.description}
      </p>
      
      <div className="flex justify-center gap-3">
        <span className={`px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-medium`}>
          🌿 {profile.saju.dominantElement}
        </span>
        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium">
          ⭐ {profile.zodiac.name}
        </span>
      </div>
    </div>
  )
}
