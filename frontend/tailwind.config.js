/** @type {import('tailwindcss').Config} */
export default {
  // content- an array specifying file paths. Tailwind will scan
  // these files for class usage and only include the necessary
  // CSS in the final build. This helps keep your output CSS file size optimized.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // used to customize and extend Tailwind's default theme
  theme: {
    // exten - allows adding new options to existing sections of the theme.
    extend: {
      // fontFamily - adds your custom 'sans' font family, using 'Roboto'
      // as the primary font and a generic 'sans-serif' fallback.
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      //gridTemplaeColumns Creates a new grid column definition named '70/30'.
      // This sets up a two-column grid where the first column
      // takes up 70% of the available width and the second column
      // takes up 30%.
      gridTemplateColumns: {
        '70/30': '70% 30%',
      },
    },
  },

  //plugins - an array for adding Tailwind CSS plugins to extend its functionality.
  plugins: [],
}
