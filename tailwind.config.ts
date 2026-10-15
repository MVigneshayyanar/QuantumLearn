import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          DEFAULT: "#4F46E5",
        },
        dark: {
          900: "#111827",
          800: "#1F2937",
          700: "#374151",
          600: "#4B5563",
          500: "#6B7280",
          400: "#9CA3AF",
          300: "#D1D5DB",
          200: "#E5E7EB",
          100: "#F3F4F6",
          50: "#F9FAFB",
        },
        quantum: {
          state0: "#4F46E5", // Indigo for |0>
          state1: "#0EA5E9", // Sky for |1>
          phase: "#8B5CF6",  // Violet for phase
          entangled: "#D97706", // Amber for mixed/entangled warning
          success: "#059669",
          error: "#DC2626",
        }
      },
      fontFamily: {
        sans: [
          "var(--font-gfg-sans)",
          "Nunito",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        article: [
          "var(--font-gfg-body)",
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-gfg-mono)",
          "Fira Code",
          "JetBrains Mono",
          "Consolas",
          "Monaco",
          "monospace",
        ],
      },
      letterSpacing: {
        tighter: '-0.01em',
        tight: '0em',
        normal: '0.015em',
        wide: '0.03em',
        wider: '0.06em',
        widest: '0.1em',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};

export default config;
