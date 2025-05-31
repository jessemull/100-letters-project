import ForbiddenPage from '@pages/forbidden/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
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
      render(
        <DesktopMenuProvider>
          <ForbiddenPage />
        </DesktopMenuProvider>,
      );
    });
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(
        <DesktopMenuProvider>
          <ForbiddenPage />
        </DesktopMenuProvider>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
