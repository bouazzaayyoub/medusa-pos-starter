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
        white: '#FFFFFF',
        transparent: 'transparent',
        border: '#e5e5e5',
        black: '#282828',
        gray: {
          light: '#F1F1F1',
          DEFAULT: '#B5B5B5',
          dark: '#888',
        },
        red: {
          DEFAULT: '#F14747',
          light: '#FFDFDF',
        },
        yellow: {
          DEFAULT: '#9B8435',
          light: '#F8EC9A',
        },
        blue: '#4E78E5',
        green: '#109D28',
      },
    },
  },
  plugins: [],
};
