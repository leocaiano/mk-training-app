/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'rose': {
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
        },
        'indigo': {
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
        },
        'violet': {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
        }
      }
    },
  },
  plugins: [],
}
