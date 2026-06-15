/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          /* Swapped to Dark Theme globally */
          bg:          '#14110D',
          bgWarm:      '#1E1A14',
          surface:     'rgba(247,244,238,0.06)',
          hairline:    'rgba(247,244,238,0.12)',
          hairlineStr: 'rgba(247,244,238,0.2)',
          /* Dark */
          dark:        '#14110D',
          dark2:       '#1E1A14',
          /* Ink (text on dark bg) */
          ink:         '#F7F4EE',
          inkSoft:     '#C9C1B2',
          inkMute:     'rgba(247,244,238,0.55)',
          /* Gold accent */
          gold:        '#A38952',
          goldDeep:    '#8A7340',
          goldSoft:    'rgba(163, 137, 82, 0.1)',
          goldBright:  '#C8A85F',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none:    '0px',
        sm:      '0px',
        md:      '0px',
        lg:      '0px',
        xl:      '0px',
        '2xl':   '0px',
        full:    '9999px',
        card:    '4px',
      },
      maxWidth: {
        container: '1320px',
        measure:   '70ch',
      },
    },
  },
  plugins: [],
}
