import Footer from './Footer';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('Footer Component', () => {
  it('Renders footer component.', () => {
    render(<Footer />);
    const footer = screen.getByText(
      '© 2025 100 Letters Project. All rights reserved.',
    );
    expect(footer).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<Footer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
