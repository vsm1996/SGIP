import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        fadeInAndOut: {
          '0%': {
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-35px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.9s ease-in-out infinite',
        fadeIn: 'fadeIn 0.9s ease-out forwards',
        fadeInUp: 'fadeInUp 0.9s ease-out forwards',
        fadeInRight: 'fadeInRight 0.9s ease-out forwards',
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["aqua", "synthwave", "corporate", "night", "nord"
      // {
      //   mytheme: {
      //     "primary": "#a991f7",
      //     "secondary": "#f6d860",
      //     "accent": "#37cdbe",
      //     "neutral": "#3d4451",
      //     "base-100": "#ffffff",
      //   },s
      // },
    ],
  },
};
export default config;
