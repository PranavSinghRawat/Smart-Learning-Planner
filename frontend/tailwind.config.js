/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#FDF4F2',
          100: '#FCE9E5',
          200: '#F8C8BD',
          300: '#F3A795',
          400: '#EF866D',
          500: '#E76F51', // Primary
          600: '#D04D2E',
          700: '#A13B24',
          800: '#722A19',
          900: '#43180F',
        },
        sage: {
          50: '#F4F9F6',
          100: '#E9F3ED',
          200: '#C8E2D2',
          300: '#A8D5BA', // Secondary
          400: '#87C6A1',
          500: '#67B888',
          600: '#4EA371',
          700: '#3D7F58',
          800: '#2C5B3F',
          900: '#1B3726',
        },
        background: '#0f172a', // Slate-900
        surface: '#1c1917',    // Stone-900 (deep earth)
        card: '#292524',       // Stone-800
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}
