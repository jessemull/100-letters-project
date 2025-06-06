import ContactPage from '@pages/contact/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('ContactPage Component', () => {
  it('Renders admin page.', async () => {
    await act(async () => {
      render(
        <DesktopMenuProvider>
          <ContactPage />
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
          <ContactPage />
        </DesktopMenuProvider>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
