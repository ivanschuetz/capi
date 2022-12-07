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
      quat: "#f6f6f8", // quaternary (on figma fields, not in palette)
      bg: "#ffffff", // background
      bg2: "#f6f6f8", // background secondary
      bg3: "#eeeef1", // background tertiary ("neural" in figma, not in the palette but in-place) TODO rename in ne* (see e.g. ne3)
      te: "#271952", // text primary ("title" in figma)
      te2: "#847c9c", // text secondary
      te3: "#aea8bf", // text tertiary ("title secondary" in figma)
      twitter: "#55acee", // use this only for twitter assets
      inp: "#554a78", // input bg, assumed on bgs with "text primary" color (note: on figma fields, not in palette)
      ne3: "#e7e7f1", // neural 3
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
        "3xl": "1700px",
        "4xl": "1920px", // "desktop" in figma
      },
    },
  },
  plugins: [],
}
