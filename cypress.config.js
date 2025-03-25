// Proxy server with signed cookie for accessing https://dev.onehundredletters.com at http://localhost:8080...

module.exports = {
  e2e: {
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://onehundredletters.com'
        : 'http://localhost:8080',
    supportFile: false,
  },
};
