'use client';

import ClockSkeleton from './ClockSkeleton';
import React, { act } from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('ClockSkeleton Component', () => {
  const resizeWindow = (width: number) => {
    (window.innerWidth as number) = width;
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders all label sections with correct layout.', () => {
    render(<ClockSkeleton />);

    expect(screen.getByText(/ink runs dry in/i)).toBeInTheDocument();

    ['DAYS', 'HRS', 'MIN', 'SEC'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    const digitSpans = screen.getAllByText('8');
    expect(digitSpans).toHaveLength(8);

    digitSpans.forEach((span) => {
      expect(span).toHaveClass('opacity-0');
    });
  });

  it('Scales to 1 when window width >= 438.', () => {
    act(() => {
      resizeWindow(500);
    });

    const { container } = render(<ClockSkeleton />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.transform).toBe('scale(1)');
  });

  it('Scales down when window width < 438 but not below 0.6.', () => {
    act(() => {
      resizeWindow(300);
    });

    const { container } = render(<ClockSkeleton />);
    const root = container.firstChild as HTMLElement;
    const expectedScale = Math.max(0.6, 300 / 438).toFixed(5);
    expect(root.style.transform).toContain(`scale(${expectedScale}`);
  });

  it('Updates scale on window resize.', () => {
    const { container } = render(<ClockSkeleton />);
    const root = container.firstChild as HTMLElement;

    act(() => {
      resizeWindow(400);
    });

    const expectedScale = Math.max(0.6, 400 / 438).toFixed(5);
    expect(root.style.transform).toContain(`scale(${expectedScale}`);
  });

  it('Cleans up resize event listener on unmount.', () => {
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

  it('Has no accessibility violations.', async () => {
    const { container } = render(<ClockSkeleton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
