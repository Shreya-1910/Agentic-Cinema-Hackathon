/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0E1116',
        'card-bg': '#171B22',
        'border-dark': '#2A2F38',
        'text-primary': '#E8E6E1',
        'text-secondary': '#B8BEC8',
        'text-muted': '#8B93A1',
        'greenlight': '#4C9A5B',
        'caution': '#D4A054',
        'pass': '#B4483F',
      },
      fontFamily: {
        'serif': ['Fraunces', 'serif'],
        'sans': ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}