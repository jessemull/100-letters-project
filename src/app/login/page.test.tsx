import LoginPage from '@pages/login/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('LoginPage Component', () => {
  it('Renders login page.', async () => {
    await act(async () => {
      render(
        <DesktopMenuProvider>
          <LoginPage />
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
          <LoginPage />
        </DesktopMenuProvider>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
