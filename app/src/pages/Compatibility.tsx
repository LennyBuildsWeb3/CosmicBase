import { useState } from 'react'
import { calculateSaju } from '../lib/saju/calculator'
import { calculateZodiac } from '../lib/western/zodiac'
import { calculateCompatibility } from '../lib/compatibility'
import type { CompatibilityResult } from '../lib/compatibility'

export function Compatibility() {
  const [person1, setPerson1] = useState({ year: 1990, month: 1, day: 1 })
  const [person2, setPerson2] = useState({ year: 1992, month: 6, day: 15 })
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [profiles, setProfiles] = useState<{ p1: { element: string; zodiac: string }; p2: { element: string; zodiac: string } } | null>(null)

  const handleCalculate = () => {
    const saju1 = calculateSaju(person1.year, person1.month, person1.day, 12)
    const zodiac1 = calculateZodiac(person1.month, person1.day)
    const saju2 = calculateSaju(person2.year, person2.month, person2.day, 12)
    const zodiac2 = calculateZodiac(person2.month, person2.day)

    const p1 = { element: saju1.dominantElement, zodiac: zodiac1.name }
    const p2 = { element: saju2.dominantElement, zodiac: zodiac2.name }
    
    setProfiles({ p1, p2 })
    setResult(calculateCompatibility(p1, p2))
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">💕 Compatibility Check</h1>
      <p className="text-gray-400 text-center">Discover your cosmic connection</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-pink-400">Person 1</h3>
          <input type="number" placeholder="Year" value={person1.year}
            onChange={e => setPerson1({ ...person1, year: +e.target.value })}
            className="w-full p-2 bg-gray-900 rounded border border-gray-700 text-white" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Month" min={1} max={12} value={person1.month}
              onChange={e => setPerson1({ ...person1, month: +e.target.value })}
              className="p-2 bg-gray-900 rounded border border-gray-700 text-white" />
            <input type="number" placeholder="Day" min={1} max={31} value={person1.day}
              onChange={e => setPerson1({ ...person1, day: +e.target.value })}
              className="p-2 bg-gray-900 rounded border border-gray-700 text-white" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-purple-400">Person 2</h3>
          <input type="number" placeholder="Year" value={person2.year}
            onChange={e => setPerson2({ ...person2, year: +e.target.value })}
            className="w-full p-2 bg-gray-900 rounded border border-gray-700 text-white" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Month" min={1} max={12} value={person2.month}
              onChange={e => setPerson2({ ...person2, month: +e.target.value })}
              className="p-2 bg-gray-900 rounded border border-gray-700 text-white" />
            <input type="number" placeholder="Day" min={1} max={31} value={person2.day}
              onChange={e => setPerson2({ ...person2, day: +e.target.value })}
              className="p-2 bg-gray-900 rounded border border-gray-700 text-white" />
          </div>
        </div>
      </div>

      <button onClick={handleCalculate}
        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-lg font-bold text-lg transition">
        Calculate Compatibility 💫
      </button>

      {result && profiles && (
        <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl p-6 border border-pink-500/30 space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {result.score}%
            </div>
            <p className="text-xl mt-2">{result.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Element Match</p>
              <p className="text-2xl font-bold text-pink-400">{result.elementScore}%</p>
              <p className="text-xs text-gray-500">{profiles.p1.element} + {profiles.p2.element}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Zodiac Match</p>
              <p className="text-2xl font-bold text-purple-400">{result.zodiacScore}%</p>
              <p className="text-xs text-gray-500">{profiles.p1.zodiac} + {profiles.p2.zodiac}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-green-400">✨ Strengths</h4>
            {result.strengths.map((s, i) => <p key={i} className="text-gray-300 text-sm">• {s}</p>)}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-yellow-400">⚡ Growth Areas</h4>
            {result.challenges.map((c, i) => <p key={i} className="text-gray-300 text-sm">• {c}</p>)}
          </div>
        </div>
      )}
    </div>
  )
}
