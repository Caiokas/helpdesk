import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ Includes all files in app directory
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ Includes UI components
    "./pages/**/*.{js,ts,jsx,tsx}", // ✅ Includes legacy pages (if any)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
