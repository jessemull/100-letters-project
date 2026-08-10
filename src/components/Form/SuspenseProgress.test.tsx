import SuspenseProgress from './SuspenseProgress';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('SuspenseProgress', () => {
  it('Renders a full-screen progress indicator.', () => {
    render(<SuspenseProgress />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<SuspenseProgress />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
