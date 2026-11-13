/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ef',
          100: '#ffe6d5',
          200: '#ffc9ab',
          300: '#ffa273',
          400: '#ff7a3d',
          500: '#f85606',
          600: '#e04a00',
          700: '#b83c00',
          800: '#8f2f00',
          900: '#6b2400',
          DEFAULT: '#f85606'
        },
        ink: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
          200: '#e5e7eb',
          100: '#f3f4f6',
          50: '#f9fafb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.1)',
        lift: '0 12px 24px -8px rgba(16, 24, 40, 0.18)'
      },
      maxWidth: {
        page: '1280px'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both'
      }
    },
  },
  plugins: [],
  important: true
}
