import ForbiddenPage from './page';
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
    expect(screen.getAllByText('100 Letters Project').length).toBe(1);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('© 2025 100 Letters Project. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(<ForbiddenPage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
