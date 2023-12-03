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
        ...require("daisyui/src/theming/themes")["retro"],
        primary: "#0c2649",
        "primary-content": "#ffffff",
        secondary: "#9955FF",
        accent: "#60F7F2",
        "base-100": "#ceb594",
        "base-200": "#f4d6af",
        "base-300": "#ffe4b6",
        neutral: "#2D3748",
        error: "#E35E39",

        "--rounded-box": "1rem",
      },
    },
      "dim"
    ],
  }
}

