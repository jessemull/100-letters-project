import AdminPage from '@pages/admin/page';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

describe('AdminPage Component', () => {
  it('Renders admin page.', async () => {
    await act(async () => {
      render(
        <DesktopMenuProvider>
          <AdminPage />
        </DesktopMenuProvider>,
      );
    });
    expect(screen.getAllByText('100 Letters Project').length).toBe(1);
    expect(
      screen.getByText('© 2025 100 Letters Project.'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(
        <DesktopMenuProvider>
          <AdminPage />
        </DesktopMenuProvider>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
