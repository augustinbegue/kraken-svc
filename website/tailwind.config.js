/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', '../lib/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      dark: {
        ...require("daisyui/src/theming/themes")["black"],
        primary: "#ceb594",
        secondary: "#9955FF",
        accent: "#60F7F2",

        "--rounded-box": "1rem",
        "--rounded-btn": "1rem",
        "--rounded-badge": "1rem",
      },
    },
      "dim"
    ],
  }
}

