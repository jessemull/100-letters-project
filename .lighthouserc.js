module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }]
      },
    },
    collect: {
      numberOfRuns: 1,
      startServer: async () => {
        await execa('npm', ['run', 'dev'], { stdio: 'inherit' });
      },
      url: ['http://localhost:3000'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
