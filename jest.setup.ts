import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

jest.mock('yet-another-react-lightbox');

jest.mock('yet-another-react-lightbox/plugins/zoom', () => ({
  __esModule: true,
  default: () => 'MockedZoomPlugin',
}));

const mockTickInstance = {
  value: undefined,
  timer: { stop: jest.fn() },
};

jest.mock('@pqina/flip', () => {
  const mockTimerStop = jest.fn();

  let onupdateCallback: ((val: string) => void) | null = null;

  const mockCounter = {
    timer: { stop: mockTimerStop },
    set onupdate(cb: (val: string) => void) {
      onupdateCallback = cb;
    },
    get onupdate() {
      return onupdateCallback!;
    },
  };

  return {
    __esModule: true,
    default: {
      DOM: {
        create: jest.fn((container, opts) => {
          if (opts && typeof opts.didInit === 'function') {
            opts.didInit(mockTickInstance);
          }
          return mockTickInstance;
        }),
        destroy: jest.fn(),
      },
      count: {
        down: jest.fn(() => mockCounter),
      },
      helper: {
        duration: jest.fn((num, unit) => {
          if (unit === 'years') {
            return num * 365 * 24 * 60 * 60 * 1000;
          }
          return 0;
        }),
      },
    },
  };
});

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
