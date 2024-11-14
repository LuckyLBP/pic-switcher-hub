import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(210, 16%, 82%)", // Soft gray for borders
        input: "hsl(220, 14%, 96%)",  // Light background for input
        ring: "hsl(220, 14%, 92%)",   // Subtle ring highlight
        background: "hsl(210, 17%, 98%)",  // Very light background
        foreground: "hsl(220, 15%, 15%)",  // Dark foreground text

        primary: {
          DEFAULT: "hsl(218, 77%, 60%)",       // Soft modern blue
          foreground: "hsl(0, 0%, 100%)",      // White for contrast
        },
        secondary: {
          DEFAULT: "hsl(217, 19%, 45%)",       // Neutral mid-gray
          foreground: "hsl(0, 0%, 100%)",      // White for contrast
        },
        destructive: {
          DEFAULT: "hsl(354, 70%, 54%)",       // Softer red for warnings
          foreground: "hsl(0, 0%, 100%)",      // White text on red background
        },
        muted: {
          DEFAULT: "hsl(210, 16%, 82%)",       // Light muted gray
          foreground: "hsl(0, 0%, 10%)",       // Darker text on muted
        },
        accent: {
          DEFAULT: "hsl(171, 75%, 41%)",       // Bright teal for accents
          foreground: "hsl(0, 0%, 100%)",      // White on teal accent
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 98%)",          // Light popover background
          foreground: "hsl(220, 15%, 15%)",    // Dark popover text
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",         // White card background
          foreground: "hsl(220, 15%, 15%)",    // Dark card text
        },
      },
      borderRadius: {
        lg: "12px",                 // Slightly rounded for modern feel
        md: "8px",
        sm: "6px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
