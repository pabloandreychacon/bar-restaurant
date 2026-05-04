/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "stadium-orange": "#ff9100",
        "stadium-yellow": "#ffc107",
        "stadium-dark": "#0a0a0a",
        "stadium-grey": "#1a1a1a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
        display: ["Impact", "Oswald", "sans-serif"],
      },
    },
  },
  plugins: [],
};
