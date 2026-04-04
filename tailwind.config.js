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
          50: '#fef7ee',
          100: '#fdecd6',
          200: '#fad6ac',
          300: '#f6b877',
          400: '#f18f40',
          500: '#ee711a',
          600: '#df5910',
          700: '#b94310',
          800: '#933614',
          900: '#6B4423', // Coffee brown
        },
        secondary: {
          DEFAULT: '#FAF3EB',
          dark: '#F5EDE3',
        },
        dark: {
          DEFAULT: '#2B2825',
          light: '#3d3834',
        },
        beige: {
          50: '#fafaf9',
          100: '#f5f4f2',
          200: '#edeae5',
          300: '#E8E4DC',
          400: '#d4cec2',
          500: '#b8af9f',
        },
      },
      fontFamily: {
        primary: ['Open Sans', 'sans-serif'],
        secondary: ['Pacifico', 'cursive'],
        heading: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}