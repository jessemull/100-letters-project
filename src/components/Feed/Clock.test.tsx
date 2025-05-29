import Clock from '@components/Feed/Clock';
import React from 'react';
import { render, screen, act } from '@testing-library/react';

jest.mock('@components/Feed', () => ({
  Digit: ({ digit }: { digit: string }) => <span>{digit}</span>,
}));

describe('Clock Component', () => {
  const realDateNow = Date.now;

  beforeEach(() => {
    jest.useFakeTimers();
    Date.now = jest.fn(() => new Date('2024-01-01T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
    Date.now = realDateNow;
  });

  it('Renders without crashing and falls back to new Date().', () => {
    render(<Clock />);
    expect(screen.getByText('Ink Runs Dry In')).toBeInTheDocument();
  });

  it('Adjusts scale when window.innerWidth < 438.', () => {
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

  it('Decrements timeLeft every second.', () => {
    render(<Clock earliestSentAtDate="2020-01-01T00:00:00Z" />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const digits = screen.getAllByText(/\d/);
    expect(digits.length).toBeGreaterThan(0);
  });
});
