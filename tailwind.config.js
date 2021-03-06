module.exports = {
  layers: ['component', 'base'],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
       borderWidth: ['hover', 'focus'],
       backgroundColor : ['active']
    },
  },
  plugins: [],
}
