import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        navy: {
          50: '#f5f4f9',
          100: '#e8e6f0',
          200: '#d1cce1',
          300: '#b3a9cc',
          400: '#8f7fb0',
          500: '#6f74c9',
          600: '#5a5fb8',
          700: '#4a4a9e',
          800: '#3d3d7f',
          900: '#1e1a49', // Navy principal
        },
        accent: {
          DEFAULT: '#6f74c9', // Periwinkle para "Tecnología"
          light: '#a5b8fc',
        },
        peach: {
          DEFAULT: '#e6b596', // Durazno
          light: '#f0d4c0',
        },
        lavender: {
          DEFAULT: '#e0e5fc', // Fondo lila muy claro
          light: '#f0f4ff',
        },
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;

