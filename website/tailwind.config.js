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
        ...require("daisyui/src/theming/themes")["business"],
        primary: "#60F7F2",
        secondary: "#9955FF",
        accent: "#C9B295",
        neutral: "#2D3748",
        "base-100": "#0C2649",
        error: "#E35E39"
      },
    },
      "dim"
    ],
  }
}

