/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: "var(--bg-deep)",
          base: "var(--bg-base)",
          elevated: "var(--bg-elevated)",
          surface: "var(--bg-surface)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
        },
        rose: {
          DEFAULT: "var(--rose)",
          muted: "var(--rose-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        expo: "var(--ease-out-expo)",
        spring: "var(--ease-spring)",
      },
      animation: {
        "fade-in": "fade-in 0.5s var(--ease-out-expo) forwards",
        "slide-up": "slide-up 0.6s var(--ease-out-expo) forwards",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
