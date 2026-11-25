/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f12',
        'bg-2': '#17171c',
        'bg-3': '#22222a',
        border: '#2e2e38',
        text: '#e8e8ea',
        'text-2': '#a1a1aa',
        accent: '#a78bfa',
        'accent-2': '#7c3aed',
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};