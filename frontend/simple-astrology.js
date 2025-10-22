/**
 * Simple astrology calculations for MVP
 * This is a simplified version - can be enhanced with Swiss Ephemeris later
 */

// Simple sun sign calculator based on birth date
function getSunSign(month, day) {
  // Zodiac date ranges (approximate)
  const signs = [
    { name: 'Capricorn', number: 10, start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', number: 11, start: [1, 20], end: [2, 18] },
    { name: 'Pisces', number: 12, start: [2, 19], end: [3, 20] },
    { name: 'Aries', number: 1, start: [3, 21], end: [4, 19] },
    { name: 'Taurus', number: 2, start: [4, 20], end: [5, 20] },
    { name: 'Gemini', number: 3, start: [5, 21], end: [6, 20] },
    { name: 'Cancer', number: 4, start: [6, 21], end: [7, 22] },
    { name: 'Leo', number: 5, start: [7, 23], end: [8, 22] },
    { name: 'Virgo', number: 6, start: [8, 23], end: [9, 22] },
    { name: 'Libra', number: 7, start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', number: 8, start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', number: 9, start: [11, 22], end: [12, 21] }
  ];

  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (month === startMonth && day >= startDay) return sign;
    if (month === endMonth && day <= endDay) return sign;
  }

  return signs[0]; // Default to Capricorn if not found
}

// Simple moon sign calculator (simplified - just offset from sun)
// Note: Real moon sign requires ephemeris data
function getMoonSignSimple(month, day) {
  const sunSign = getSunSign(month, day);
  // Moon moves ~13° per day, roughly one sign every 2.5 days
  // This is a VERY simplified approximation for MVP
  const offset = Math.floor(day / 2.5) % 12;
  const moonNumber = ((sunSign.number + offset - 1) % 12) + 1;

  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  return {
    name: signs[moonNumber - 1],
    number: moonNumber
  };
}

// Simple rising sign calculator (requires birth time and location)
// Note: Real ascendant requires precise calculations
function getRisingSignSimple(hour, month) {
  // Very simplified: hour + month combination
  // This is placeholder logic for MVP
  const risingNumber = ((hour + month - 1) % 12) + 1;

  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  return {
    name: signs[risingNumber - 1],
    number: risingNumber
  };
}

// Calculate full birth chart
function calculateBirthChart(birthData) {
  const { year, month, day, hour, minute, latitude, longitude } = birthData;

  const sunSign = getSunSign(month, day);
  const moonSign = getMoonSignSimple(month, day);
  const risingSign = getRisingSignSimple(hour, month);

  return {
    sun: sunSign,
    moon: moonSign,
    rising: risingSign,
    birthData: {
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude
    }
  };
}

// Test
console.log('🌙 Testing Simple Astrology Calculations...\n');

const testData = {
  year: 1990,
  month: 1,
  day: 15,
  hour: 10,
  minute: 30,
  latitude: 40.7128,
  longitude: -74.0060
};

console.log('Birth Data:', testData);
console.log('\n--- Calculated Chart ---\n');

const chart = calculateBirthChart(testData);

console.log(`Sun Sign: ${chart.sun.name} (${chart.sun.number})`);
console.log(`Moon Sign: ${chart.moon.name} (${chart.moon.number})`);
console.log(`Rising Sign: ${chart.rising.name} (${chart.rising.number})`);

console.log('\n--- For Smart Contract ---');
console.log(`sunSign: ${chart.sun.number}`);
console.log(`moonSign: ${chart.moon.number}`);
console.log(`risingSign: ${chart.rising.number}`);

console.log('\n✅ Simple calculations working!');
console.log('\n📝 Note: This uses simplified calculations for MVP.');
console.log('   For production, integrate Swiss Ephemeris for accuracy.');

// Export for use in Next.js
module.exports = {
  calculateBirthChart,
  getSunSign,
  getMoonSignSimple,
  getRisingSignSimple
};
