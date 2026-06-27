import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        surface: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
          sidebar: "#0f172a",
          header: "#111827",
        },
      },
      boxShadow: {
        panel: "0 1px 2px rgba(124, 58, 237, 0.06)",
        card: "0 1px 3px 0 rgba(124, 58, 237, 0.04), 0 1px 2px -1px rgba(124, 58, 237, 0.03)",
        elevated:
          "0 4px 6px -1px rgba(124, 58, 237, 0.06), 0 2px 4px -2px rgba(124, 58, 237, 0.04)",
        input: "0 1px 2px rgba(124, 58, 237, 0.03)",
        soft: "0 2px 8px rgba(124, 58, 237, 0.06), 0 1px 2px rgba(124, 58, 237, 0.04)",
        glow: "0 0 20px rgba(124, 58, 237, 0.12)",
      },
      height: {
        18: "4.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      fontSize: {
        "2xl": ["1.5rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "shimmer":
          "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.03) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
