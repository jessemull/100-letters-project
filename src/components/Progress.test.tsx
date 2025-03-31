import Progress from './Progress';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';

describe('Progress Component', () => {
  it('Renders progress.', async () => {
    await act(async () => {
      render(<Progress />);
    });
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(<Progress />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
