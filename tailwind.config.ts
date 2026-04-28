import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'apple-blue': '#0071e3',
        'apple-gray': '#6e6e73',
        'apple-light': '#f5f5f7',
        'apple-border': '#d2d2d7',
      },
    },
  },
  plugins: [],
}
export default config
