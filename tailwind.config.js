const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // --- BASE ---
        background: colors.gray[100], // Main app background
        card: colors.white, // Background for all cards

        // --- SIDEBAR ---
        sidebar: colors.gray[900],
        'sidebar-text': colors.gray[200],
        'sidebar-text-active': colors.white,
        'sidebar-text-hover': colors.white,
        'sidebar-hover': colors.gray[700],
        'sidebar-logout-text': colors.gray[400],
        'sidebar-logout-text-hover': colors.red[400],

        // --- TEXT ---
        'text-primary': colors.gray[800], // For titles
        'text-secondary': colors.gray[500], // For subtitles, paragraphs
        'text-accent': colors.indigo[700], // For important snippets, like category names

        // --- PRIMARY (BRAND) COLOR ---
        // We're just re-exporting indigo so we can use 'primary-500', 'primary-600', etc.
        primary: colors.indigo,
      },
    },
  },
  plugins: [],
};
