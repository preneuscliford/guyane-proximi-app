/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "tropical-green": "#2D6A4F",
        "sky-blue": "#52B2CF",
        "sun-yellow": "#F9C74F",
        "terracotta-red": "#B7410E",
        "cream-white": "#FAF3DD",
        "mango-orange": "#F4A261",
        "light-gray": "#E5E5E5",
        "emerald-green": "#81B29A",
      },
    },
  },
  plugins: [],
};
