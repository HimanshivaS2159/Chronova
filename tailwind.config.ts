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
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "cinematic-zoom": "cinematicZoom 20s ease-in-out infinite alternate",
        "pulse-ring": "pulseRing 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
      },
      keyframes: {
        cinematicZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(5px, -15px)" },
          "66%": { transform: "translate(-8px, 10px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.33)" },
          "80%, 100%": { opacity: "0" },
        },
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(var(--accent-rgb), 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(var(--accent-rgb), 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.4)" },
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
        "day-hover": "0 4px 16px rgba(var(--accent-rgb), 0.3)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.15)",
        "glow-indigo": "0 0 15px rgba(99, 102, 241, 0.4)",
        "glow-amber": "0 0 15px rgba(245, 158, 11, 0.4)",
        "premium-lg": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "ultra-glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
