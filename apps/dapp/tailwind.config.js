// const { tailwindThemeConfig } = require('@dopex-io/ui');

module.exports = {
  safelist: ['bg-red-500', 'bg-emerald-500'],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    fontFamily: {
      sans: ['Ilisarniq'],
      serif: ['Ilisarniq'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    extend: {
      colors: {
        primary: '#002EFF',
        silver: '#C4C4C4',
        stieglitz: '#8E8E8E',
        umbra: '#1E1E1E',
        mineshaft: '#3E3E3E',
        carbon: '#2D2D2D',
        'cod-gray': '#151515',
        'wave-blue': '#22E1FF',
        'down-bad': '#FF617D',
        'up-only': '#6DFFB9',
        jaffa: '#F09242',
        frost: '#C3F8FF',
      },
    },
  },
  plugins: [],
};
