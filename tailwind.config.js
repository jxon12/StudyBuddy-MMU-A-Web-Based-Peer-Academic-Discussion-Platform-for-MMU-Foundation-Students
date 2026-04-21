/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
