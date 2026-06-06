/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF6EC',
          100: '#FFE2C8',
          200: '#FFC69A',
          400: '#FB923C',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        surface: {
          0:   '#FFFFFF',
          50:  '#FAFAF8',
          100: '#F4F3EF',
          200: '#E8E6E0',
          300: '#D6D3CB',
        },
        ink: {
          900: '#1A1916',
          700: '#3D3B35',
          500: '#6B6860',
          300: '#9C9990',
          100: '#C8C5BD',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'scan-line':  'scanLine 2s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        scanLine:  { '0%': { top: '0%' }, '100%': { top: '100%' } },
      },
    },
  },
  plugins: [],
}
