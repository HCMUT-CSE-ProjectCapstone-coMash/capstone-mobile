module.exports = {
  content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
      extend: {
        colors: {
            gwhite: "#F9F9FB",
            tgray2: "#D6D6D6",
            tgray50: "#FAFAFA",
            tgray5: "#808080",
            tgray6: "#616161",
            tgray9: "#0D0D0D",
            purple: "#6420AA",
            lightPurple: "#DEBDFF",
            pink: "#FF3EA5",
            lightPink: "#FFB5DA",
            red: "#D10000"
        },
        fontFamily: {
            display: ["Inter"],
        }
      },
  },
  plugins: [],
};