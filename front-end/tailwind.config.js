// tailwind.config.js
module.exports = {
  darkMode: 'class', // Sử dụng phương pháp 'class' cho Dark Mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx,scss}", // Bao gồm các tệp SCSS nếu cần
  ],
  theme: {
    extend: {
      colors: {
        'primary-text': 'var(--primary-color-text)',
        'primary-bg-1': 'var(--primary-color-background-1)',
        'primary-bg-2': 'var(--primary-color-background-2)',
        'primary-hover': 'var(--primary-color-hover)',
      },
    },
  },
  plugins: [],
}