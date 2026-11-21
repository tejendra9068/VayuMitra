/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High contrast semantic AQI colors matching Indian CPCB / US EPA standards
        aqi: {
          good: "#15803d",         // 0-50 Green (contrast checked)
          satisfactory: "#65a30d", // 51-100 Light Green/Olive
          moderate: "#d97706",     // 101-200 Amber/Orange
          poor: "#dc2626",         // 201-300 Red
          veryPoor: "#9333ea",     // 301-400 Purple
          severe: "#7f1d1d",       // 401-500+ Dark Maroon / Crimson
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
