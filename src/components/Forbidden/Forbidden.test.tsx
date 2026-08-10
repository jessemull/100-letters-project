import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import Forbidden from './Forbidden';

describe('Forbidden', () => {
  it('renders access denied messaging and home link', () => {
    render(<Forbidden />);
    expect(
      screen.getByRole('heading', { name: /access denied/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Forbidden />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
