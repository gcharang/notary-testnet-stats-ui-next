/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xss: "375px",
      xms: "410px",
      xs: "475px",
      sm: defaultTheme.screens.sm, //640
      md: defaultTheme.screens.md, //768
      lg: defaultTheme.screens.lg, //1024
      xl: defaultTheme.screens.xl, //1280
      xlm: "1440px", //mac
      "2xl": "1512px", //mac //defaultTheme.screens["2xl"], //1536
      "2xlm": "1728px", //mac
      "3xl": "1920px",
      "4xl": "2048px",
      "5xl": "3840px",
      ultrawide: { raw: "(min-aspect-ratio: 2/1)" },
      tiny: { raw: "(max-height: 766px) and (orientation: landscape)" },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
        20: "repeat(20, minmax(0, 1fr))",
        24: "repeat(24, minmax(0, 1fr))",
        32: "repeat(32, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
        "span-17": "span 17 / span 17",
        "span-18": "span 18 / span 18",
        "span-19": "span 19 / span 19",
        "span-20": "span 20 / span 20",
        "span-22": "span 20 / span 22",
        "span-24": "span 24 / span 24",
      },
      colors: {
        br: {
          "lighter-black": "#161927",
        }
      }
    },
  },
  plugins: [],
};
