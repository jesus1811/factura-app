import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        alertError: "#CC525F",
        current: "currentColor",
        dark: {
          500: "#000000",
          100: "#111111",
          50: "#0A0A0A",
        },
        gray: {
          500: "#333333",
        },
        primary: {
          300: "#74aafb",
          400: "#5c9bfa",
          500: "#5A57EE",
        },
        secundary: {
          900: "#9A009C",
          800: "#AF00B3",
          700: "#C500CC",
          600: "#DA00E5",
          500: "#F000FF",
          400: "#F657FF",
          300: "#FB80FF",
          200: "#FFC3FF",
          100: "#FFC3FF",
          50: "#FFE1FF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
