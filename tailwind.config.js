module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['helvetica', 'sans-serif'],
      },
      colors: {
        'bg-primary': '#1E2331',
        'bg-second': '#142a41',
        'bg-third': '#2e3085',
      },
      boxShadow: {
        box: '0px 0px 5px 2px rgba(255, 255, 255, 0.5)',
      },
    },
    textShadow: {
      xl: '0px 1px 5px 3px rgba(255, 255, 255, 0.5)',
    },
    paintOrder: {
      fsm: { paintOrder: 'fill stroke markers' },
      fms: { paintOrder: 'fill markers stroke' },
      sfm: { paintOrder: 'stroke fill markers' },
      smf: { paintOrder: 'stroke markers fill' },
      mfs: { paintOrder: 'markers fill stroke' },
      msf: { paintOrder: 'markers stroke fill' },
    },
  },
  variants: {
    // all the following default to ['responsive']
    textFillColor: ['responsive'],
    textStrokeColor: ['responsive'],
    textStrokeWidth: ['responsive'],
    paintOrder: ['responsive'],
  },
  plugins: [require('tailwindcss-text-fill-stroke')()],
}
