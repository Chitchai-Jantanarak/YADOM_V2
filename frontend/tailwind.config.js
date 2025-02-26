/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        tertiary: 'var(--tertiary-color)',
      },

      animation: {
        'moveVertical': 'moveVertical 30s ease infinite',
        'moveInCircle': 'moveInCircle 20s ease infinite',
        'moveHorizontal': 'moveHorizontal 40s ease infinite',
      },
      keyframes: {
        moveVertical: {
          '0%': { transform: 'translateY(-50%)' },
          '50%': { transform: 'translateY(50%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        moveInCircle: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        moveHorizontal: {
          '0%': { transform: 'translateX(-50%) translateY(-10%)' },
          '50%': { transform: 'translateX(50%) translateY(10%)' },
          '100%': { transform: 'translateX(-50%) translateY(-10%)' },
        },
      },
    

      fontFamily: {
        'noto-sans-thai': ['Noto Sans Thai', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'alike': ['Alike', 'serif'],
        'concert-one': ['Concert One', 'cursive'],
        'montserrat': ['montserrat', 'sans-serif'],
        'anybody': ['Anybody', 'cursive'],
        'archivo': ['archivo', 'sans-serif'],
        'zentokyozoo': ['zentokyozoo', 'sans-serif']
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],

  // daisyui: {
  //   themes: ['sunset']
  // }
}

