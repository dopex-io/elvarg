const { tailwindThemeConfig } = require('@dopex-io/ui');

module.exports = {
  safelist: ['bg-red-500', 'bg-emerald-500'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
    './node_modules/@dopex-io/ui/**/*.{js,jsx,ts,tsx}',
  ],
  theme: tailwindThemeConfig,
  plugins: [],
};
