'use client';

import ClockSkeleton from './ClockSkeleton';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('ClockSkeleton Component', () => {
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
    expect(digitSpans).toHaveLength(9);

    digitSpans.forEach((span) => {
      expect(span).toHaveClass('opacity-0');
    });
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<ClockSkeleton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
