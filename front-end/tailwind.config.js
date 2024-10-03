// tailwind.config.js
module.exports = {
  darkMode: "class", // Sử dụng phương pháp 'class' cho Dark Mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        "primary-text": "var(--primary-color-text)",
        "primary-bg-1": "var(--primary-color-background-1)",
        "primary-bg-2": "var(--primary-color-background-2)",
        "primary-hover": "var(--primary-color-hover)",
      },
    },
  },
  plugins: [],
};