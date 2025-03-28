import Feed from './Feed';
import { axe } from 'jest-axe';
import { render, screen, waitFor, act } from '@testing-library/react';

describe('Feed Component', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('Renders envelope.', () => {
    render(<Feed />);
    expect(screen.getByTestId('envelope')).toBeInTheDocument();
  });

  it('Renders coming soon message.', async () => {
    jest.useFakeTimers();
    render(<Feed />);
    expect(screen.getByText('Coming Soon...').parentElement).toHaveClass(
      'opacity-0',
    );
    act(() => {
      jest.advanceTimersByTime(3500);
    });
    await waitFor(() => {
      expect(screen.getByText('Coming Soon...').parentElement).toHaveClass(
        'opacity-100',
      );
      expect(screen.queryByTestId('envelope')).toBeNull();
    });
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<Feed />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
