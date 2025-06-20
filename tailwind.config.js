// tailwind.config.js (KODE YANG BENAR)
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./src/index.css", // <-- TAMBAHKAN BARIS INI
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }