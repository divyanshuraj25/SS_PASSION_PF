import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F4EE",
        paper: "#FCFBF8",
        ink: "#1C2624",
        charcoal: "#2A332F",
        emerald: {
          DEFAULT: "#2E5A4C",
          dark: "#1F4137",
          light: "#3F7563",
        },
        brass: {
          DEFAULT: "#B08A55",
          light: "#D3B583",
        },
        line: "#E4DFD1",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,38,36,0.06), 0 8px 24px rgba(28,38,36,0.06)",
      },
      borderRadius: {
        card: "0.625rem",
      },
    },
  },
  plugins: [],
};
export default config;
