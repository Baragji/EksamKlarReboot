/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gamified: {
          red: '#e21b3c',
          'red-light': '#ff4757',
          'red-dark': '#c0392b',
          blue: '#1368ce',
          'blue-light': '#3498db',
          'blue-dark': '#2c3e50',
          yellow: '#ffa602',
          'yellow-light': '#f39c12',
          'yellow-dark': '#e67e22',
          green: '#26890c',
          'green-light': '#2ecc71',
          'green-dark': '#27ae60',
          purple: '#9c2bde',
          'purple-light': '#9b59b6',
          'purple-dark': '#8e44ad',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        gamified: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gamified-primary': 'linear-gradient(135deg, #9c2bde 0%, #1368ce 50%, #26890c 100%)',
        'gradient-gamified-warm': 'linear-gradient(135deg, #e21b3c 0%, #ffa602 100%)',
        'gradient-gamified-cool': 'linear-gradient(135deg, #1368ce 0%, #9c2bde 100%)',
        'gradient-gamified-success': 'linear-gradient(135deg, #2ecc71 0%, #26890c 100%)',
        'gradient-gamified-danger': 'linear-gradient(135deg, #ff4757 0%, #e21b3c 100%)',
      },
      borderRadius: {
        'gamified': '1.5rem',
        'gamified-sm': '0.5rem',
        'gamified-lg': '2rem',
      },
      boxShadow: {
        'gamified': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'gamified-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'gamified-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'hover-lift': 'hover-lift 0.3s ease-out',
      },
      keyframes: {
        'hover-lift': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
