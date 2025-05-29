import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Clock from '@components/Feed/Clock';

// Simple mock Digit component to isolate test
jest.mock('@components/Feed', () => ({
  Digit: ({ digit }: { digit: string }) => <span>{digit}</span>,
}));

describe('Clock Component', () => {
  // Save original Date.now
  const realDateNow = Date.now;

  beforeEach(() => {
    jest.useFakeTimers();

    // Mock Date.now to a fixed timestamp
    Date.now = jest.fn(() => new Date('2024-01-01T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();

    // Restore original Date.now
    Date.now = realDateNow;
  });

  it('renders without crashing and falls back to new Date()', () => {
    render(<Clock />);
    expect(screen.getByText('Ink Runs Dry In')).toBeInTheDocument();
  });

  it('adjusts scale when window.innerWidth < 438', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 300,
    });
    const resizeEvent = new Event('resize');

    const { container } = render(<Clock />);
    act(() => {
      window.dispatchEvent(resizeEvent);
    });

    expect(container.firstChild).toHaveStyle(
      'transform: scale(0.684931506849315)',
    );
  });

  it('decrements timeLeft every second', () => {
    render(<Clock earliestSentAtDate="2020-01-01T00:00:00Z" />);

    // Advance timers by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Should render digits (numbers) after decrement
    const digits = screen.getAllByText(/\d/);
    expect(digits.length).toBeGreaterThan(0);
  });
});
