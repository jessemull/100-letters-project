const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/src/app/layout.tsx',
    '/src/constants/index.ts',
    '/src/components/index.ts',
    '/src/components/.*/index.ts',
    '/src/contexts/index.ts',
    '/src/factories/index.ts',
    '/src/hooks/index.ts',
    '/src/types/',
    '/src/util/index.ts',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@factories/(.*)$': '<rootDir>/src/factories/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@ts-types/(.*)$': '<rootDir>/src/types/$1',
    '^@util/(.*)$': '<rootDir>/src/util/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

module.exports = createJestConfig(customJestConfig);
