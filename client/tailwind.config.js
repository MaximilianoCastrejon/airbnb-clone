/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F5385D'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'sulphur-point': ['Sulphur Point', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      gridTemplateRows: {
        // Simple 8 row grid
        7: 'repeat(7, minmax(0, 1fr))'
      },

      screens: {
        tablet: '640px',
        // => @media (min-width: 640px) { ... }

        laptop: '1024px',
        // => @media (min-width: 1024px) { ... }

        desktop: '1280px'
        // => @media (min-width: 1280px) { ... }
      }
    }
  },
  plugins: []
};
