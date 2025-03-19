module.exports = {
  e2e: {
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://onehundredletters.com'
        : 'https://dev.onehundredletters.com',
    supportFile: false,
  },
};
