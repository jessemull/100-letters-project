import CountDownClock from './CountDownClock';
import React from 'react';
import { CountDown } from '@ts-types/feed';
import { axe } from 'jest-axe';
import { calculateCountdown } from '@util/feed';
import { render, screen, act } from '@testing-library/react';

jest.mock('@util/feed', () => ({
  calculateCountdown: jest.fn(),
}));

describe('CountDownClock Component', () => {
  const mockCountdown: CountDown = {
    days: 10,
    hours: 5,
    minutes: 30,
    seconds: 15,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (calculateCountdown as jest.Mock).mockReturnValue(mockCountdown);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  it('Renders fallback text before countdown is initialized.', () => {
    render(<CountDownClock earliestSentAtDate="2024-01-01T00:00:00Z" />);
    expect(
      screen.getByText('Countdown clock kicking off soon...'),
    ).toBeInTheDocument();
  });

  it('Renders countdown once interval ticks.', () => {
    render(<CountDownClock earliestSentAtDate="2024-01-01T00:00:00Z" />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(
      screen.getByText('Countdown to the Letter-o-calypse:'),
    ).toBeInTheDocument();
    expect(screen.getByText('10d 5h 30m 15s')).toBeInTheDocument();
  });

  it('Does not run countdown logic when no date is provided.', () => {
    render(<CountDownClock earliestSentAtDate={''} />);
    expect(
      screen.getByText('Countdown clock kicking off soon...'),
    ).toBeInTheDocument();
    expect(calculateCountdown).not.toHaveBeenCalled();
  });

  it('Cleans up interval on unmount.', () => {
    const clearSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(
      <CountDownClock earliestSentAtDate="2024-01-01T00:00:00Z" />,
    );

    unmount();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    clearSpy.mockRestore();
  });

  it('Has no accessibility violations.', async () => {
    jest.useRealTimers();
    const { container } = render(
      <CountDownClock earliestSentAtDate="2024-01-01T00:00:00Z" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
