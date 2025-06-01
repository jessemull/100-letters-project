import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        midnight: '#1F2937',
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
      },
      screens: {
        'sm-tablet': '500px',
        'md-tablet': '650px',
      },
    },
  },
  plugins: [],
} satisfies Config;
