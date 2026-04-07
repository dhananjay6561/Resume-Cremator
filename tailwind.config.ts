import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        brand: "#E5451F",
        "brand-hover": "#c93a18",
        "brand-orange": "#F97316",
        surface: {
          DEFAULT: "#1E293B",
          muted: "#0F172A",
          elevated: "#243449",
        },
        border: {
          DEFAULT: "#334155",
          muted: "#1E293B",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.4s ease-out both",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(229, 69, 31, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(229, 69, 31, 0.6)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)",
        "gradient-radial-fire":
          "radial-gradient(ellipse at center, rgba(229,69,31,0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
