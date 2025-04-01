/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",   // Include Next.js app directory components
      "./src/components/**/*.{js,ts,jsx,tsx}", // Include reusable components
      "./src/pages/**/*.{js,ts,jsx,tsx}", // If using `pages/` directory
    ],
    theme: {
      extend: {}, // You can customize colors, spacing, etc.
    },
    plugins: [],
  };
  