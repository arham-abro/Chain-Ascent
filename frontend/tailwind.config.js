/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        card: "rgba(15, 23, 42, 0.75)",
        accent: "#6366f1",
        accentGlow: "#818cf8",
        success: "#10b981",
        danger: "#f43f5e",
        gold: "#f59e0b",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'rocket-rise': 'rocketRise 1s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.9))' },
        },
      },
    },
  },
  plugins: [],
}
