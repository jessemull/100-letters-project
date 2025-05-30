import React from 'react';
import { Categories } from '@components/Feed';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('Categories Commponent', () => {
  it('Renders the categories.', () => {
    render(<Categories />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Categories />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
