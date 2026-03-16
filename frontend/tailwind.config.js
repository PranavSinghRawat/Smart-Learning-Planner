/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tc: {
          50: '#fdf5f2', 100: '#fae8e2', 200: '#f5cfc4', 300: '#edaa96',
          400: '#e27d62', 500: '#d4603f', 600: '#c04d2e', 700: '#9f3d24',
          800: '#83341f', 900: '#6c2f1e',
        },
        sg: {
          50: '#f2f8f5', 100: '#e2f0ea', 200: '#c5e2d3', 300: '#9dcdb5',
          400: '#6db494', 500: '#4d9474', 600: '#3a775c', 700: '#2f5f49',
          800: '#274d3c', 900: '#213f32',
        },
        /* Page background */
        page:   '#f8f7f5',
        /* Card / panel */
        card:   '#ffffff',
        /* Subtle fill */
        subtle: '#f4f4f5',
        muted:  '#f0efed',
        /* Border */
        line:   '#e4e4e7',
        'line-strong': '#d4d4d8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px' }],
        'xs':  ['12px', { lineHeight: '18px' }],
        'sm':  ['13px', { lineHeight: '20px' }],
        'base':['14px', { lineHeight: '22px' }],
        'md':  ['15px', { lineHeight: '24px' }],
        'lg':  ['17px', { lineHeight: '26px' }],
        'xl':  ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
        '4xl': ['34px', { lineHeight: '42px' }],
      },
      borderRadius: {
        'sm': '6px', 'md': '8px', 'lg': '12px',
        'xl': '16px', '2xl': '20px', '3xl': '28px',
      },
      boxShadow: {
        'card':       '0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 0 0 1px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.07), 0 12px 24px rgba(0,0,0,0.06)',
        'tc':         '0 1px 2px rgba(212,96,63,0.2), 0 4px 12px rgba(212,96,63,0.18)',
        'sg':         '0 1px 2px rgba(77,148,116,0.2), 0 4px 12px rgba(77,148,116,0.16)',
        'header':     '0 1px 0 rgba(0,0,0,0.06)',
        'none':       'none',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
