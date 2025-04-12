/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    animation: {
      'spin-slow': 'spin 5s linear infinite',
      'spin-slower': 'spin 9s linear infinite',
    },
    colors: {
      'custom-orange': '#ee9b00',
      'custom-orange-light': '#ee9b00a6',
    },
  },
},
variants: {},
plugins: [],
}
