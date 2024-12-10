
const { nextui } = require("@nextui-org/react");
import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require("@iconify/tailwind");
module.exports = {
  darkMode: 'class', // Enables dark mode
  // daisyui: {
  //   themes: ["light", "dark", "cupcake"],
  // },

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
  
      blur: {
        xs: '2px',
      },
      colors: {
        background: "#0F0F0F", // Dark mode background color
        textPrimary: "#FFFFFF", // Dark mode text color
        accent: "#F95045", // Accent color
        muted: "#7A7A7A", // Muted text color
        cardBg: "#181818", // Card background color
        themColor:'#cc99ff',
        dropdown :'#21130d'

      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },

  darkMode: "class",
  plugins: [nextui(), require("daisyui"), addDynamicIconSelectors(), require('tailwind-scrollbar')],
};
