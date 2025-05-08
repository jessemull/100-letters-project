import ForbiddenPage from '@pages/forbidden/page';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('AccessDeniedPage Component', () => {
  it('Renders access denied 403 page.', async () => {
    await act(async () => {
      render(<ForbiddenPage />);
    });
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(<ForbiddenPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
