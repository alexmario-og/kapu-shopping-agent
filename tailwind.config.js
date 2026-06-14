/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF5EC",
        ink: "#2B2620",
        "ink-soft": "#6B6258",
        terracotta: "#D9533F",
        "terracotta-dark": "#B8412F",
        basil: "#4A7C59",
        gold: "#E2A33B",
        card: "#FFFFFF",
        line: "#EAE2D6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        sinhala: ["var(--font-noto-sinhala)", "sans-serif"],
      },
      borderRadius: { card: "1.25rem", chip: "999px" },
      boxShadow: {
        soft: "0 8px 24px -8px rgba(43, 38, 32, 0.15)",
        lift: "0 12px 32px -10px rgba(43, 38, 32, 0.22)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-once": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.35s ease-out",
        "pulse-once": "pulse-once 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
