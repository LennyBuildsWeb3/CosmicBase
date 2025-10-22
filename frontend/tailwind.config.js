/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          purple: '#6B46C1',
          blue: '#2D3748',
          gold: '#D69E2E',
          dark: '#1A202C',
        },
      },
    },
  },
  plugins: [],
}
