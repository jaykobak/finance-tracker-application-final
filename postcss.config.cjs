module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...process.env.NODE_ENV === 'production'
      ? {
          '@fullhuman/postcss-purgecss': {
            content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            safelist: {
              standard: ['html', 'body'],
              deep: [/^dark/, /^light/],
            },
          }
        }
      : {}
  }
};