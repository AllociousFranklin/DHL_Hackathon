/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dhl: {
          yellow: '#FFCC00',
          red: '#D40511',
          black: '#1A1A1A',
          dark: '#111215',
          card: '#1C1E24',
          border: '#2E323B',
          gray: '#F4F4F6',
          muted: '#8A909D',
        },
        status: {
          good: '#008542',
          bad: '#D40511',
          more: '#E58A00',
          unknown: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
