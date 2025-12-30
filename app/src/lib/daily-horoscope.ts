const DAILY_MESSAGES: Record<string, string[]> = {
  Wood: [
    "Growth energy surrounds you today. Plant seeds for future success.",
    "Your creative spirit is strong. Express yourself freely.",
    "Connect with nature to recharge your Wood element energy."
  ],
  Fire: [
    "Your passion burns bright today. Lead with confidence.",
    "Transform challenges into opportunities with your inner fire.",
    "Share your warmth with others - your energy is contagious."
  ],
  Earth: [
    "Stability is your strength today. Ground yourself in routine.",
    "Nurture your relationships - they need your steady presence.",
    "Trust your practical instincts for important decisions."
  ],
  Metal: [
    "Precision and clarity guide you today. Cut through confusion.",
    "Your determination is unshakeable. Pursue your goals.",
    "Refine your plans - details matter more than usual."
  ],
  Water: [
    "Flow with changes today. Adaptability is your superpower.",
    "Your intuition is heightened. Trust your inner voice.",
    "Deep connections are possible. Open up to others."
  ]
}

const ZODIAC_DAILY: Record<string, string[]> = {
  Aries: ["Bold moves pay off today.", "Your leadership shines.", "Take initiative in love."],
  Taurus: ["Financial luck is strong.", "Comfort brings clarity.", "Patience rewards you."],
  Gemini: ["Communication flows easily.", "New connections await.", "Share your ideas."],
  Cancer: ["Home matters need attention.", "Emotional insights arrive.", "Nurture yourself."],
  Leo: ["Spotlight finds you today.", "Creative projects thrive.", "Romance is favored."],
  Virgo: ["Details reveal solutions.", "Health focus pays off.", "Organize for success."],
  Libra: ["Balance brings peace.", "Partnerships strengthen.", "Beauty inspires you."],
  Scorpio: ["Transformation accelerates.", "Hidden truths emerge.", "Power grows quietly."],
  Sagittarius: ["Adventure calls you.", "Learning expands horizons.", "Optimism attracts luck."],
  Capricorn: ["Career advances possible.", "Discipline creates results.", "Long-term plans solidify."],
  Aquarius: ["Innovation strikes today.", "Community connections grow.", "Unique ideas succeed."],
  Pisces: ["Dreams hold messages.", "Compassion opens doors.", "Artistic flow is strong."]
}

export function getDailyHoroscope(element: string, zodiac: string): { element: string; zodiac: string; combined: string; luckyNumber: number; luckyColor: string } {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  
  const elementMsgs = DAILY_MESSAGES[element] || DAILY_MESSAGES.Fire
  const zodiacMsgs = ZODIAC_DAILY[zodiac] || ZODIAC_DAILY.Aries
  
  const elementMsg = elementMsgs[dayOfYear % elementMsgs.length]
  const zodiacMsg = zodiacMsgs[dayOfYear % zodiacMsgs.length]
  
  const colors = ['Red', 'Blue', 'Green', 'Gold', 'Purple', 'Silver', 'Orange']
  const luckyNumber = ((dayOfYear * 7) % 99) + 1
  const luckyColor = colors[dayOfYear % colors.length]
  
  return {
    element: elementMsg,
    zodiac: zodiacMsg,
    combined: `${elementMsg} ${zodiacMsg}`,
    luckyNumber,
    luckyColor
  }
}
