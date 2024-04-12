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

