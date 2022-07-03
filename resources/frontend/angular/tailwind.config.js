module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // ctrl + k -> ctrl + g for tailwind shades generator
        primary: {
          100: '#D4CAF7',
          200: '#B7A7F2',
          300: '#9B83ED',
          400: '#7E60E7',
          500: '#613CE2',
          600: '#441EC8',
          700: '#331797',
          800: '#230F66',
          900: '#120836'
        },
        secondary: {
          100: '#FCFFE1',
          200: '#F7FFB8',
          300: '#F3FF90',
          400: '#EEFF67',
          500: '#EAFF3E',
          600: '#E4FF06',
          700: '#B7CD00',
          800: '#859500',
          900: '#535D00'
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
