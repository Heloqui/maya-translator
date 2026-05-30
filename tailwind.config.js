/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maya: {
          bg: '#0f0f1e',
          surface: '#1a1a35',
          deep: '#12122a',
          darker: '#0a0a18',
          gold: '#c9a84c',
          'gold-dim': '#a08a3e',
          text: '#e0e0e0',
          muted: '#888888',
          border: '#2a2a4a',
        },
        confidence: {
          confirmed: '#4caf50',
          probable: '#cddc39',
          tentative: '#f44336',
          unknown: '#666666',
        },
      },
    },
  },
  plugins: [],
}
