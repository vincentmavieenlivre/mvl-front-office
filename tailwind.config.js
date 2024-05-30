/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ripple: theme => ({
      colors: theme('colors'),
      darken: 0.05
  }),

  fontSize:{
    xs: '0.75rem', // Extra Small
    sm: '0.875rem', // Small
    base: '1rem', // Base
    lg: '1.125rem', // Large
    xl: '1.25rem', // Extra Large
    "4xl": "4em"
  }

  },


  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#38bdf8",
        },
      },
   
    ],
  },


  plugins: [require("daisyui"), require('tailwindcss-ripple')()],
}

