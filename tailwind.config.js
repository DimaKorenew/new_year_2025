/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
        },
        secondary: {
          DEFAULT: '#059669',
          dark: '#047857',
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        'dark-main': '#1F2937',
      },
    },
  },
  plugins: [],
}
