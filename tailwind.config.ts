import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#14141C",
        surfaceAlt: "#1C1C28",
        accent: "#3ADE7C",   // vert du maillot du personnage
        accentDeep: "#1FA85A",
        violet: "#8B5CF6",   // détails violets des chaussures
        gold: "#E8C468",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      boxShadow: {
        premium: "0 8px 40px -8px rgba(58,222,124,0.25)",
        card: "0 4px 24px -4px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
