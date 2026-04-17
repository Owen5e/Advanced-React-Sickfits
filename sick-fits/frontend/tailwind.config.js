/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Unified, sophisticated color palette
        primary: {
          DEFAULT: '#dc2626', // Softer, more sophisticated red
          light: '#ef4444',
          dark: '#b91c1c'
        },
        secondary: {
          DEFAULT: '#1f2937', // Dark slate gray
          light: '#374151',
          dark: '#111827'
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        accent: {
          DEFAULT: '#059669', // Sophisticated green for positive actions
          light: '#10b981',
          dark: '#047857'
        },
        // Legacy colors for backward compatibility
        red: '#dc2626',
        black: '#1f2937',
        grey: '#4b5563',
        lightGrey: '#e5e7eb',
        offWhite: '#f9fafb'
      },
      maxWidth: {
        // Preserving the maxWidth variable
        1000: '1000px'
      },
      boxShadow: {
        // Preserving the box-shadow variable
        custom: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
        subtle: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
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
        6: '3rem',
        8: '4rem'
      },
      transitionDuration: {
        400: '400ms'
      },
      transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
