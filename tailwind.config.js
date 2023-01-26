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
      bg3: "#eeeef1", // background tertiary ("neural" in figma, not in the palette but in-place) TODO remove and use ne2
      te: "#271952", // text primary ("title" in figma)
      te2: "#847c9c", // text secondary
      te3: "#aea8bf", // text tertiary ("title secondary" in figma)
      twitter: "#55acee", // use this only for twitter assets
      inp: "#554a78", // input bg, assumed on bgs with "text primary" color (note: on figma fields, not in palette)
      // ne: "#f6f6f8",
      ne2: "#eeeef1", // neural 2
      ne3: "#e7e7f1", // neural 3
      ne4: "#524b67", // neural 4
    },
    fontSize: {
      35: "12px",
      36: "13px",
      40: "14px",
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
      // Important: when editing sizes, edit the programmatic WindowSizeClasses too
      // (used to render conditionally)
      screens: {
        "3xl": "1700px",
        "4xl": "1920px", // "desktop" in figma
      },
      backgroundImage: {
        dashed_border: "url('/dashed_border.svg')",
        dashed_border_round: "url('/dashed_border_round.svg')",
      },
      aspectRatio: {
        banner: "3",
      },
    },
  },
  plugins: [],
}
