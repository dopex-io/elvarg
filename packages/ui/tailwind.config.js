/** @type {import('tailwindcss').Config} */

const tailwindThemeConfig = require("./src/tailwindThemeConfig.json");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./stories/**/*.{js,jsx,ts,tsx}"],
  theme: tailwindThemeConfig,
};
