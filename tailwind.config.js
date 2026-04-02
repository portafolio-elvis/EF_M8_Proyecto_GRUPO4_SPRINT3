/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.hbs',
    './public/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'brutal':    '6px 6px 0 #000000',
        'brutal-lg': '8px 8px 0 #000000',
        'brutal-sm': '4px 4px 0 #000000',
      },
    },
  },
  safelist: [
    'dragging',
    'drag-over',
    'badge-Feature',
    'badge-Task',
    'badge-Bug',
    'badge-Improvement',
    'tag-Feature',
    'tag-Bug',
    'tag-Hotfix',
  ],
  plugins: [],
}
