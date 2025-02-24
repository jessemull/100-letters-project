const execa = require('execa');

const isProduction = process.env.NODE_ENV === 'production'; // or other environment check

module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: isProduction ? 0.9 : 0.85 }], // Lower score for staging
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    collect: {
      numberOfRuns: 1,
      startServer: async () => {
        await execa('npm', ['run', 'dev'], { stdio: 'inherit' });
      },
      url: isProduction ? ['https://onehundredletters.com'] : ['http://localhost:3000'], // Change URL based on environment
    },
    upload: {
      target: 'temporary-public-storage', // You can upload to a dashboard if you want persistent results
    },
  },
};
