/* eslint-disable @typescript-eslint/no-var-requires */

/** from https://tailwindcss.com/docs/font-size */
const defaultFontSizes = {
  '2xs': ['0.7rem', '1rem'],
  xs: ['0.75rem', '1rem'],
  sm: ['0.875rem', '1.25rem'],
  md: ['1rem', '1.5rem'], // md is same as base
  base: ['1rem', '1.5rem'],
  lg: ['1.125rem', '1.75rem'],
  xl: ['1.25rem', '1.75rem'],
  '2xl': ['1.5rem', '2rem'],
  '3xl': ['1.875rem', '2.25rem'],
  '4xl': ['2.25rem', '2.5rem'],
  '5xl': ['3rem', '1'],
  '6xl': ['3.75rem', '1'],
  '7xl': ['4.5rem', '1'],
  '8xl': ['6rem', '1'],
  '9xl': ['8rem', '1'],
  '10xl': ['10rem', '1'],
}

const fontSize = Object.keys(defaultFontSizes).reduce((result, current) => {
  const value = defaultFontSizes[current]
  return {
    ...result,
    [current]: [
      `var(--font-size-${current}, ${value[0]})`,
      `var(--line-height-${current}, ${value[1]})`,
    ],
  }
}, {})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  safelist: [
    { pattern: /^btn-.*/ },
    { pattern: /^text-.*/ },
    'underline',
    { pattern: /^col-span-.*/ },
  ],
  theme: {
    extend: { fontSize },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes').light,
          primary: '#AE0736',
          'primary-content': '#ffffff',

          secondary: '#DB0026',
          'secondary-content': '#ffffff',

          accent: '#9467DE',
          'accent-content': '#ffffff',

          neutral: '#3d4451',
          'neutral-content': '#ffffff',

          'base-content': '#1f2937',

          info: '#2094f3',
          success: '#199759',
          warning: '#ff9900',
          error: '#f22510',
        },
      },
    ],
  },
}
