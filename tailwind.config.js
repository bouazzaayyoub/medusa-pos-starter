/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './contexts/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        border: '#e5e5e5',
        black: '#282828',
        gray: {
          light: '#F1F1F1',
          DEFAULT: '#B5B5B5',
          dark: '#888',
        },
        error: '#F14747',
      },
    },
  },
  plugins: [],
};
