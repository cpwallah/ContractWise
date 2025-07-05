module.exports = {
  theme: {
    extend: {
      animation: {
        "glow-pulse-intense": "glow-pulse-intense 2s ease-in-out infinite",
        "cascade-wave": "cascade-wave 0.9s ease-out forwards",
        "bounce-right": "bounce-right 1s infinite",
        "drift-sparkle": "drift-sparkle 8s ease-in-out infinite",
        "drift-delayed": "drift-sparkle 8s ease-in-out 2s infinite",
        "drift-slow": "drift-sparkle 10s ease-in-out 1s infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        "aurora-pulse": "aurora-pulse 15s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse-intense": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(45, 212, 191, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(45, 212, 191, 0.8)" },
        },
        "cascade-wave": {
          "0%": { opacity: 0, transform: "translateY(50px) scale(0.9)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        "bounce-right": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(6px)" },
        },
        "drift-sparkle": {
          "0%, 100%": { transform: "translate(0, 0)", opacity: 0.6 },
          "50%": { transform: "translate(12px, -18px)", opacity: 1 },
        },
        twinkle: {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 1 },
        },
        "aurora-pulse": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(45, 212, 191, 0.5)" },
          "50%": { boxShadow: "0 0 24px rgba(45, 212, 191, 0.7)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(165, 180, 252, 0.15)" },
          "50%": { borderColor: "rgba(165, 180, 252, 0.3)" },
        },
      },
      boxShadow: {
        "glow-sparkle":
          "0 0 20px rgba(45, 212, 191, 0.7), 0 0 40px rgba(45, 212, 191, 0.4)",
        "glow-2xl":
          "0 0 25px rgba(45, 212, 191, 0.8), 0 0 50px rgba(45, 212, 191, 0.5)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      colors: {
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
        },
        cyan: {
          100: "#cffafe",
          200: "#a5f3fc",
          500: "#06b6d4",
          600: "#0891b2",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
        },
        gold: {
          200: "#fefcbf",
          400: "#facc15",
          600: "#d97706",
        },
      },
    },
  },
};
