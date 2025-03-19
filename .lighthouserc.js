const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    collect: {
      numberOfRuns: 3,
      startServer: async () => {
        const execa = await import('execa');
        await execa('npm', ['run', 'dev'], { stdio: 'inherit' });
      },
      url: isProduction
        ? ['https://onehundredletters.com']
        : ['https://dev.onehundredletters.com'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
