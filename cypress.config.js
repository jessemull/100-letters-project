module.exports = {
  e2e: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://www.onehundredletters.com' : 'http://localhost:3000',
    supportFile: false,
  },
};
