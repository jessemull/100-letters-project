import Envelope from './Envelope';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen, waitFor, act } from '@testing-library/react';

jest.mock('react-resize-detector', () => ({
  useResizeDetector: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  __esModule: true,
  AnimatePresence: ({ children }) => <>{children}</>,
  motion: {
    div: jest.fn().mockImplementation(({ animate, children, ...props }) => (
      <div data-animate={JSON.stringify(animate)} {...props}>
        {children}
      </div>
    )),
  },
}));

describe('Envelope Component', () => {
  let mockContainerRef;
  let useResizeDetectorMock;

  beforeEach(() => {
    mockContainerRef = { current: document.createElement('div') };
    useResizeDetectorMock = require('react-resize-detector').useResizeDetector;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderWithWidth = (width) => {
    useResizeDetectorMock.mockReturnValue({ width });
    return render(<Envelope containerRef={mockContainerRef} />);
  };

  it('Renders envelope.', () => {
    renderWithWidth(1024);
    expect(screen.getByTestId('envelope')).toBeDefined();
  });

  it('Triggers animations correctly.', async () => {
    jest.useFakeTimers();
    renderWithWidth(1024);
    act(() => {
      jest.advanceTimersByTime(3500);
    });
    await waitFor(() => {
      expect(screen.getByText('Letters')).toBeDefined();
    });
  });

  it.each([
    [100, 'text-xs'],
    [150, 'text-sm'],
    [200, 'text-lg'],
    [300, 'text-xl'],
    [400, 'text-2xl'],
    [1500, 'text-3xl'],
    [3000, 'text-4xl'],
  ])('Sets correct text size at width %i', (width, expectedTextSize) => {
    jest.useFakeTimers();
    renderWithWidth(width);
    act(() => {
      jest.advanceTimersByTime(3500);
    });
    const message = screen.getByTestId('msg-100').parentElement;
    expect(message as HTMLElement).toHaveClass(expectedTextSize);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = renderWithWidth(1024);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
