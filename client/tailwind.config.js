/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: '#87CEEB',
        skyDark: '#4FA5D1',
        grass: '#a3e635',
        grassDark: '#65a30d',
        wood: '#c2410c',
        woodLight: '#ea580c',
        paper: '#fef3c7',
        ink: '#1e293b',
        gold: '#fbbf24',
        cloud: '#ffffff',
      },
      fontFamily: {
        'sans': ['"Nunito"', 'sans-serif'],
        'display': ['"Fredoka"', 'cursive'],
      },
      boxShadow: {
        'cartoon': '0 8px 0 0 #1e293b',
        'cartoon-active': '0 2px 0 0 #1e293b',
        'cartoon-hover': '0 12px 0 0 #1e293b',
        'cartoon-sm': '0 4px 0 0 #1e293b',
      },
      animation: {
        'bob': 'bob 3s ease-in-out infinite',
        'cloud-move': 'cloudMove 30s linear infinite',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        cloudMove: {
          '0%': { backgroundPosition: '0% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
