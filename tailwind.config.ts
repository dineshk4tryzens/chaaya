import type { Config } from "tailwindcss";
import { Constants } from "./app/styles/constants";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      screens: {
        xs: '350px', // Add a custom breakpoint
      },
    },
    backgroundImage: {
      'image-light': `url(${Constants.BG_Light})`,
      'image-dark': `url(${Constants.BG_Dark})`
    },
    backgroundPosition: {
      'x-10': '10% center', // Sets background-position-x to 10%
      'x-0': '0% center', // Sets background-position-x to 0%
    },
    backgroundSize: {
      '170-100': '170% 100%', // Adds custom background-size value
      '200-100': '240% 100%', // Adds custom background-size value
    },
  },
  corePlugins: {
    transitionProperty: true,
  },
  plugins: [],
} satisfies Config;
