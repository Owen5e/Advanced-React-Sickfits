/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Preserving the existing color scheme from styled-components
        red: '#ff0000',
        black: '#393939',
        grey: '#3A3A3A',
        lightGrey: '#E1E1E1',
        offWhite: '#EDEDED'
      },
      maxWidth: {
        // Preserving the maxWidth variable
        1000: '1000px'
      },
      boxShadow: {
        // Preserving the box-shadow variable
        custom: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'
      },
      fontFamily: {
        // Adding custom font
        radnika: [
          'radnika_next',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif'
        ]
      },
      fontSize: {
        // Base font size is 10px in styled-components (1rem = 10px)
        // Tailwind uses 16px as base, so we need to adjust
        base: '1.5rem', // 15px equivalent to 1.5rem in styled-components
        lg: '1.8rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem'
      },
      spacing: {
        // Custom spacing for consistency
        1: '0.5rem',
        2: '1rem',
        3: '1.5rem',
        4: '2rem',
        5: '2.5rem',
        6: '3rem'
      }
    }
  },
  plugins: []
};
