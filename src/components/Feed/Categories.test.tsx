import React from 'react';
import { Categories } from '@components/Feed';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => <div data-testid="image">Image</div>,
}));

describe('Categories Component', () => {
  it('Renders the categories.', () => {
    render(<Categories />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('Links to the category page for each tile.', () => {
    render(<Categories />);
    const link = screen.getByRole('link', {
      name: /view letters in category technology/i,
    });
    expect(link).toHaveAttribute('href', '/category?category=Technology');
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Categories />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
