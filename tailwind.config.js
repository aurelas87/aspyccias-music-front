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
      fontSize: {
        inherit: 'inherit'
      },
      colors: {
        background: '#000000',
        'dark-grey': '#1d1d1b',
        primary: '#cd7025',
        'brown-dark': '#94400D',
        yellow: '#FFF69E',
        info: '#4694e1',
        success: '#00a189',
        error: '#c45258',
        'neutral-750': 'rgb(51, 51, 51)'
      }
    },
  },
  plugins: [],
}
