import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BirthDateInput } from '../components/BirthDateInput'
import { calculateSaju } from '../lib/saju/calculator'
import { calculateZodiac } from '../lib/western/zodiac'
import { createCosmicProfile } from '../lib/cosmic/profile'
import { saveProfile } from '../lib/storage'

export function Calculate() {
  const navigate = useNavigate()
  const [birthData, setBirthData] = useState({ year: 1990, month: 1, day: 1, hour: 12 })

  const handleCalculate = () => {
    const saju = calculateSaju(birthData.year, birthData.month, birthData.day, birthData.hour)
    const zodiac = calculateZodiac(birthData.month, birthData.day)
    const profile = createCosmicProfile(saju, zodiac)
    saveProfile(profile)
    navigate('/result')
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">Enter Your Birth Info</h1>
      <p className="text-gray-400 text-center mb-8">We'll calculate your Saju and Western zodiac</p>
      
      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur">
        <BirthDateInput value={birthData} onChange={setBirthData} />
        
        <button
          onClick={handleCalculate}
          className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-lg hover:opacity-90 transition"
        >
          ✨ Calculate My Cosmic Profile
        </button>
      </div>
    </div>
  )
}
