import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

global.IntersectionObserver = jest.fn(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  root: null,
  rootMargin: '',
  takeRecords: jest.fn(),
  thresholds: [],
  unobserve: jest.fn(),
}));

expect.extend(toHaveNoViolations);
