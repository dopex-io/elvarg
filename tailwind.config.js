module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    options: {
      safelist: ['bg-red-500', 'bg-green-500'],
    },
  },
  darkMode: 'class',
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
        'cod-gray': '#151515',
        'wave-blue': '#22E1FF',
        'down-bad': '#FF617D',
      },
      minWidth: {
        400: '400px',
        640: '640px',
      },
      margin: {
        1.75: '0.41rem',
      },
      spacing: {
        84: '21rem',
      },
    },
  },
  variants: {
    extend: {
      display: ['dark', 'group-hover'],
      invert: ['dark'],
      brightness: ['dark'],
      filter: ['dark'],
      borderWidth: ['hover'],
    },
  },
  plugins: [],
};
