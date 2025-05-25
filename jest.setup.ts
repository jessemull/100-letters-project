import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

jest.mock('yet-another-react-lightbox');

jest.mock('yet-another-react-lightbox/plugins/zoom', () => ({
  __esModule: true,
  default: () => 'MockedZoomPlugin',
}));

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
