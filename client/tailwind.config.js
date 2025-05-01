/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00', // bright orange
          50: '#FFF2E6',
          100: '#FFE0CC',
          200: '#FFC299',
          300: '#FFA366',
          400: '#FF8533',
          500: '#FF6B00',
          600: '#CC5500',
          700: '#994000',
          800: '#662A00',
          900: '#331500',
        },
        dark: {
          DEFAULT: '#121212', // primary black
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#121212',
        },
        success: {
          DEFAULT: '#22C55E',
          50: '#E6F6ED',
          500: '#22C55E',
          900: '#0D4824',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FEF7EA',
          500: '#F59E0B',
          900: '#8D5804',
        },
        error: {
          DEFAULT: '#EF4444',
          50: '#FDEBEB',
          500: '#EF4444',
          900: '#8D1F1F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};