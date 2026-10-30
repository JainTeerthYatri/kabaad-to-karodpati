import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Desi color palette
        kabaad: {
          50: "#fef3e2",
          100: "#fde8c8",
          200: "#fad393",
          300: "#f6b354",
          400: "#f28f21",
          500: "#ed730c",
          600: "#dc5a0a",
          700: "#b5420d",
          800: "#913514",
          900: "#752e14",
          950: "#3f1308",
        },
        loha: {
          50: "#f0f0f0",
          100: "#d9d9d9",
          200: "#b3b3b3",
          300: "#8c8c8c",
          400: "#666666",
          500: "#4d4d4d",
          600: "#3d3d3d",
          700: "#333333",
          800: "#2b2b2b",
          900: "#262626",
        },
        taamba: {
          50: "#fff4ed",
          100: "#ffe0cc",
          200: "#ffc799",
          300: "#ffa355",
          400: "#ff7d1f",
          500: "#e85d0c",
          600: "#c43e05",
          700: "#9c2f07",
          800: "#7d270a",
          900: "#65230c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Rajdhani", "system-ui", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;