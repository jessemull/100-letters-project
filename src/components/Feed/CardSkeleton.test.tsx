import React from 'react';
import { CardSkeleton } from '@components/Feed';
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';

describe('CardSkeleton Component', () => {
  it('Renders without crashing.', () => {
    const { container } = render(<CardSkeleton />);
    expect(container).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<CardSkeleton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
