import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import ComingSoon from './ComingSoon';

describe('ComingSoon', () => {
  it('renders project copy', () => {
    render(<ComingSoon />);
    expect(screen.getByText(/100 Letters Project/i)).toBeInTheDocument();
    expect(screen.getByText(/write 100 letters/i)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ComingSoon />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
