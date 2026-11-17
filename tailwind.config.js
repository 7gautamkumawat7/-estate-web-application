/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#101820", // Primary background
          800: "#17232D", // Secondary background
          700: "#1E2C38",
          600: "#243644",
        },
        gold: {
          DEFAULT: "#C6A66B", // Main champagne gold
          light: "#D9C29A",   // Secondary accent
          dark: "#A8884C",
          50: "#FAF7F2",
          100: "#F4EFE6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFB",
          subtle: "#F1F4F6",
        },
        brandText: {
          primary: "#18232C",
          secondary: "#77818A",
          muted: "#9BA3A9",
        },
        borderBase: {
          light: "#E8E8E8",
          dark: "#253443",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 20px 40px -15px rgba(16, 24, 32, 0.08)",
        "premium-hover": "0 30px 60px -12px rgba(16, 24, 32, 0.15)",
        gold: "0 10px 25px -5px rgba(198, 166, 107, 0.25)",
      },
    },
  },
  plugins: [],
};
