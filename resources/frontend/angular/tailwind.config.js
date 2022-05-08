module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // ctrl + k -> ctrl + g for tailwind shades generator
        primary: {
          100: "#fcd8e4",
          200: "#f9b1c9",
          300: "#f68aaf",
          400: "#f36394",
          500: "#f03c79",
          600: "#c03061",
          700: "#902449",
          800: "#601830",
          900: "#300c18"
        },
        secondary: {
          100: "#d7fbd8",
          200: "#aff7b1",
          300: "#87f48a",
          400: "#5ff063",
          500: "#37ec3c",
          600: "#2cbd30",
          700: "#218e24",
          800: "#165e18",
          900: "#0b2f0c"
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
