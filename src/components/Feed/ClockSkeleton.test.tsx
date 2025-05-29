'use client';

import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import ClockSkeleton from './ClockSkeleton';

describe('ClockSkeleton', () => {
  const resizeWindow = (width: number) => {
    (window.innerWidth as number) = width;
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all label sections with correct layout', () => {
    render(<ClockSkeleton />);

    expect(screen.getByText(/ink runs dry in/i)).toBeInTheDocument();

    ['DAYS', 'HRS', 'MIN', 'SEC'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    // Find all spans with the digit text
    const digitSpans = screen.getAllByText('8');
    expect(digitSpans).toHaveLength(8);

    digitSpans.forEach((span) => {
      expect(span).toHaveClass('opacity-0');
    });
  });

  it('scales to 1 when window width >= 438', () => {
    act(() => {
      resizeWindow(500);
    });

    const { container } = render(<ClockSkeleton />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.transform).toBe('scale(1)');
  });

  it('scales down when window width < 438 but not below 0.6', () => {
    act(() => {
      resizeWindow(300);
    });

    const { container } = render(<ClockSkeleton />);
    const root = container.firstChild as HTMLElement;
    const expectedScale = Math.max(0.6, 300 / 438).toFixed(5); // precision match
    expect(root.style.transform).toContain(`scale(${expectedScale}`);
  });

  it('updates scale on window resize', () => {
    const { container } = render(<ClockSkeleton />);
    const root = container.firstChild as HTMLElement;

    act(() => {
      resizeWindow(400); // triggers scale change
    });

    const expectedScale = Math.max(0.6, 400 / 438).toFixed(5);
    expect(root.style.transform).toContain(`scale(${expectedScale}`);
  });

  it('cleans up resize event listener on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ClockSkeleton />);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });
});
