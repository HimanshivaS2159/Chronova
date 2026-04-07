import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        accent: {
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
        },
      },
      animation: {
        "page-flip": "pageFlip 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in": "fadeIn 0.3s ease",
        "slide-up": "slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        shimmer: "shimmer 1.5s infinite",
        ripple: "ripple 0.6s ease-out",
        todayPulse: "todayPulse 2s ease-in-out infinite",
      },
      keyframes: {
        pageFlip: {
          "0%": { transform: "rotateX(0deg)", opacity: "1" },
          "50%": { transform: "rotateX(-90deg)", opacity: "0" },
          "51%": { transform: "rotateX(90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        todayPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(99,102,241,0.4)" },
          "50%": { boxShadow: "0 0 0 6px rgba(99,102,241,0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        calendar:
          "0 25px 60px -12px rgba(0,0,0,0.25), 0 8px 20px -8px rgba(0,0,0,0.15)",
        "calendar-dark":
          "0 25px 60px -12px rgba(0,0,0,0.6), 0 8px 20px -8px rgba(0,0,0,0.4)",
        day: "0 2px 8px rgba(0,0,0,0.08)",
        "day-hover": "0 4px 16px rgba(99,102,241,0.3)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
