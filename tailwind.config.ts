import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'nhw-cyan':    '#6CF0C2',
        'nhw-amber':   '#EEC059',
        'nhw-bg':      '#040608',
        'nhw-surface': '#070b0d',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['88px', { lineHeight: '0.9',  letterSpacing: '-0.05em', fontWeight: '800' }],
        'headline-lg': ['52px', { lineHeight: '1.0',  letterSpacing: '-0.03em', fontWeight: '700' }],
        'headline-md': ['30px', { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg':     ['18px', { lineHeight: '1.6',  letterSpacing: '0',       fontWeight: '400' }],
        'body-md':     ['15px', { lineHeight: '1.7',  letterSpacing: '0',       fontWeight: '400' }],
        'label-lg':    ['13px', { lineHeight: '1.2',  letterSpacing: '0.05em',  fontWeight: '700' }],
        'label-sm':    ['11px', { lineHeight: '1.2',  letterSpacing: '0.05em',  fontWeight: '500' }],
      },
    },
  },
  plugins: [typography],
}

export default config
