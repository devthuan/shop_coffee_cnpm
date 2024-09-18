/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Sử dụng phương pháp 'class' cho Dark Mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx,scss}", // Thêm SCSS vào danh sách quét
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
