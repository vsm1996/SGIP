/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'wiggle': 'wiggle 0.9s ease-in-out infinite',
        'fade-in': 'fadeIn 0.9s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.9s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.9s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
};
