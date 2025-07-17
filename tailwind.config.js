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
    fontSize: {
      '4xl': {
        fontSize: '2.5rem',
        fontWeight: '600',
        lineHeight: '3.5rem',
      },
      '3xl': {
        fontSize: '2rem',
        fontWeight: '500',
        lineHeight: '3rem',
      },
      '2xl': {
        fontSize: '1.5rem',
        fontWeight: '500',
        lineHeight: '2.5rem',
      },
      xl: {
        fontSize: '1.25rem',
        fontWeight: '500',
        lineHeight: '2rem',
      },
      lg: {
        fontSize: '1.125rem',
        fontWeight: '500',
        lineHeight: '1.5rem',
      },
      base: {
        fontSize: '1rem',
        fontWeight: '500',
        lineHeight: '1.375rem',
      },
      sm: {
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.125rem',
      },
      xs: {
        fontSize: '0.75rem',
        fontWeight: '500',
        lineHeight: '1rem',
      },
      '2xs': {
        fontSize: '0.6875rem',
        fontWeight: '500',
        lineHeight: '0.875rem',
      },
      '3xs': {
        fontSize: '0.625rem',
        fontWeight: '500',
        lineHeight: '0.75rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        transparent: 'transparent',
        white: '#FFF',
        gray: {
          100: '#F1F1F1',
          200: '#E5E5E5',
          300: '#B5B5B5',
          400: '#888888',
        },
        black: '#282828',
        success: {
          200: '#B9F1B2',
          500: '#469B3B',
        },
        warning: {
          200: '#F8EC9A',
          500: '#9B8435',
        },
        error: {
          200: '#FFDFDF',
          500: '#F14747',
        },
        active: {
          200: '#B8CCFF',
          500: '#4E78E5',
          700: '#4E78E5',
        },
      },
    },
  },
  plugins: [],
};
