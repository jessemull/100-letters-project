// Proxy server with signed cookie for accessing https://dev.onehundredletters.com at http://localhost:8080...

const urls = {
  production: 'https://onehundredletters.com',
  test: 'http://localhost:8080',
};

const throttling = {
  production: 'simulate',
  test: 'simulate',
};

module.exports = {
  ci: {
    assert: {
      assertions: {
        // Performance is noisy on CI runners; warn so merges are not blocked/rolled back.
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    collect: {
      numberOfRuns: 3,
      settings: {
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
        throttlingMethod: throttling[process.env.NODE_ENV] || 'simulate',
      },
      url: urls[process.env.NODE_ENV] || 'http://localhost:3000',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
