/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Cabin',
          ...defaultTheme.fontFamily.sans,
        ]
      },
      colors: {
        background: '#1d1d1b',
        primary: '#cd7025',
        'brown-dark': '#94400D',
        'yellow': '#FFF69E',
      }
    },
  },
  plugins: [],
}
