import { Feed } from '@components/Feed';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('Feed Component', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('Renders envelope.', () => {
    render(<Feed />);
    expect(screen.getByTestId('envelope')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon...')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<Feed />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
