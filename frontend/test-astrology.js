// Test astrology calculations
const CircularNatalHoroscopeJS = require('circular-natal-horoscope-js');

console.log('🌙 Testing CircularNatalHoroscopeJS...\n');

// Sample birth data - January 15, 1990, 10:30 AM, New York
const person = new CircularNatalHoroscopeJS.Person(
  'Test Person',
  1990,
  1,   // January
  15,
  10,  // hour
  30,  // minute
  40.7128,   // latitude (New York)
  -74.0060,  // longitude
  0         // timezone offset (GMT)
);

console.log('Birth Data:');
console.log('  Date: January 15, 1990');
console.log('  Time: 10:30 AM');
console.log('  Location: New York (40.7128°N, 74.0060°W)\n');

try {
  const planets = person.Planets;
  const ascendant = person.Ascendant;
  const houses = person.Houses;

  console.log('✅ Chart Calculated Successfully!\n');

  // Sun Sign
  const sun = planets.sun;
  console.log(`Sun: ${sun.ChartPosition.Zodiac.Sign} ${sun.ChartPosition.Zodiac.Degree.toFixed(2)}°`);

  // Moon Sign
  const moon = planets.moon;
  console.log(`Moon: ${moon.ChartPosition.Zodiac.Sign} ${moon.ChartPosition.Zodiac.Degree.toFixed(2)}°`);

  // Ascendant (Rising)
  console.log(`Ascendant: ${ascendant.ChartPosition.Zodiac.Sign} ${ascendant.ChartPosition.Zodiac.Degree.toFixed(2)}°`);

  console.log('\nAll Planetary Positions:');
  Object.keys(planets).forEach(planetName => {
    const planet = planets[planetName];
    if (planet && planet.ChartPosition) {
      const zodiac = planet.ChartPosition.Zodiac;
      console.log(`  ${planetName.padEnd(12)}: ${zodiac.Sign.padEnd(12)} ${Math.floor(zodiac.Degree)}°`);
    }
  });

  console.log('\nHouse Cusps:');
  houses.forEach((house, index) => {
    console.log(`  House ${(index + 1).toString().padStart(2)}: ${house.ChartPosition.Zodiac.Sign}`);
  });

  // Helper function to convert zodiac sign to number (1-12)
  const zodiacToNumber = (sign) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs.indexOf(sign) + 1;
  };

  console.log('\n--- Data for Smart Contract ---');
  console.log(`Sun Sign (1-12): ${zodiacToNumber(sun.ChartPosition.Zodiac.Sign)}`);
  console.log(`Moon Sign (1-12): ${zodiacToNumber(moon.ChartPosition.Zodiac.Sign)}`);
  console.log(`Rising Sign (1-12): ${zodiacToNumber(ascendant.ChartPosition.Zodiac.Sign)}`);

  console.log('\n🎉 Astrology library working perfectly!');
  console.log('\n✅ Ready for Next.js integration!');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
}
