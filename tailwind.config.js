/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "neon-blue": "#00F6FF",
        "electric-violet": "#7D5FFF",
        "carbon-black": "#1A1A1D",
        "fuchsia-pink": "#FF006E",
        "ice-white": "#E6E6E6",
        "lime-neon": "#AFFF00",
        "steel-gray": "#2E2E3E",
        "cyber-orange": "#FF8C32",
        "deep-blue": "#14213D",
        "tropical-green": "#2D6A4F",
        "sky-blue": "#52B2CF",
        "sun-yellow": "#F9C74F",
        "terracotta-red": "#B7410E",
        "cream-white": "#FAF3DD",
        "mango-orange": "#F4A261",
        "light-gray": "#E5E5E5",
        "emerald-green": "#81B29A",
        "ghost-white": "#F5F8FD",
        "white-2": "#FCFDFE",
        "rich-black": "#181F27",
      },
    },
  },
  plugins: [],
};
