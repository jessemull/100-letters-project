import AboutPage from '@pages/about/page';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('ContactPage Component', () => {
  it('Renders about page.', async () => {
    await act(async () => {
      render(
        <DesktopMenuProvider>
          <AboutPage />
        </DesktopMenuProvider>,
      );
    });
    expect(screen.getAllByText('100 Letters Project').length).toBe(2);
    expect(
      screen.getByText('© 2025 100 Letters Project.'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(
        <DesktopMenuProvider>
          <AboutPage />
        </DesktopMenuProvider>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
