/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      pr: "#de5c62", // primary
      sec: "#6bb9bd", // secondary
      ter: "#6672d7", // tertiary (repeated "secondary" in figma)
      bg: "#ffffff", // background
      bg2: "#f6f6f8", // background secondary
      te: "#271952", // text primary ("title" in figma)
      te2: "#847c9c", // text secondary
      te3: "#aea8bf", // text tertiary ("title secondary" in figma)
    },
    fontSize: {
      45: "16px",
      50: "18px",
      60: "24px",
      70: "32px",
      80: "40px",
      90: "64px",
    },
    lineHeight: {
      6: "150%",
      8: "160%",
    },
    extend: {
      screens: {
        "4xl": "1920px", // "desktop" in figma
      },
    },
  },
  plugins: [],
}
