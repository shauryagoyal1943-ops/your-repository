/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff', 100: '#d9eaff', 200: '#bcd9ff', 300: '#8ec2ff',
          400: '#599fff', 500: '#3377ff', 600: '#1f57f5', 700: '#1843de',
          800: '#1a39b1', 900: '#1c358c', 950: '#152256',
        },
        accent: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
        },
        ink: {
          50: '#f7f8fa', 100: '#eef0f4', 200: '#dde1e8', 300: '#c2c8d4',
          400: '#9aa3b2', 500: '#6b7484', 600: '#4a5260', 700: '#353c47',
          800: '#22262e', 900: '#15181d', 950: '#0c0e12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(15,20,40,0.06), 0 1px 2px rgba(15,20,40,0.04)',
        pop: '0 10px 30px rgba(15,20,40,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
        'pop': 'pop 0.25s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(12px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        pop: { '0%': { transform: 'scale(0.9)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
