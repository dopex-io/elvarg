/** @type {import('tailwindcss').Config} */

module.exports = {
  presets: [require("tailwind-config/theme")],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./stories/**/*.{js,jsx,ts,tsx}"],
};
