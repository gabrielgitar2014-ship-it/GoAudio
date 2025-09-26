// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root', // <-- ADICIONE ESTA LINHA
  theme: {
    extend: {},
  },
  plugins: [],
}