import React from 'react';
import { Completion } from '@components/Feed';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('Completion Commponent', () => {
  it('Renders the categories.', () => {
    render(<Completion letterCount={10} />);
    expect(screen.getByText('Letters Written')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Completion letterCount={10} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
