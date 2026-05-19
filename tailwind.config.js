/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'apple': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'retropix': ['Retropix', 'sans-serif'],
      },
      colors: {
        'apple-blue': '#0A84FF',
        'apple-coral': '#FF453A',
        'apple-mint': '#30D158',
        'apple-indigo': '#636EFF',
        'apple-purple': '#BF5AF2',
      },
    },
  },
  plugins: [],
}
