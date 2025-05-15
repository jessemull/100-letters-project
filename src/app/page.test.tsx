import HomePage from '@pages/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('HomePage Component', () => {
  it('Renders homepage.', () => {
    render(
      <DesktopMenuProvider>
        <HomePage />
      </DesktopMenuProvider>,
    );
    expect(screen.getAllByText('100 Letters Project').length).toBe(2);
    expect(
      screen.getByText('© 2025 100 Letters Project. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(
      <DesktopMenuProvider>
        <HomePage />
      </DesktopMenuProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
