import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import About from './About';

jest.mock('@components/Animation', () => ({
  Envelope: () => <div data-testid="envelope" />,
}));

jest.mock('@components/ComingSoon', () => ({
  ComingSoon: () => <p>Coming soon body</p>,
}));

describe('About', () => {
  it('renders the coming soon heading', () => {
    render(<About />);
    expect(
      screen.getByRole('heading', { name: /coming soon/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('envelope')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<About />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
