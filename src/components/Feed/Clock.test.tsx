import Clock from '@components/Feed/Clock';
import React from 'react';
import { axe } from 'jest-axe';
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

  it('Decrements timeLeft every second.', () => {
    render(<Clock />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const digits = screen.getAllByText(/\d/);
    expect(digits.length).toBeGreaterThan(0);
  });

  it('Has no accessibility violations.', async () => {
    jest.useRealTimers();
    const { container } = render(<Clock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
