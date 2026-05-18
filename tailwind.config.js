/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'macaron-pink': '#FFB6C1',
        'soft-peach': '#FFDAB9',
        'cream-white': '#FFF0F5',
        'deep-gray': '#4A4A4A',
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(255, 182, 193, 0.25)',
        'glow': '0 0 20px rgba(255, 182, 193, 0.4)',
      },
      borderRadius: {
        'cute': '1.5rem',
      },
      animation: {
        'bounce-soft': 'bounceSoft 0.3s ease-in-out',
        'heart-beat': 'heartBeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.1)' },
          '20%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.1)' },
          '40%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
