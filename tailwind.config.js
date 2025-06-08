/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rounded': ['M PLUS Rounded 1c', 'sans-serif'],
        'elegant': ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
