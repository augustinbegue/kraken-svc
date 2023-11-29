/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      dark: {
        ...require("daisyui/src/theming/themes")["black"],
        primary: "#ceb594",
        secondary: "#ffb511",
        accent: "#bb1e3a"
      }
    }],
  }
}

