import HomePage from '@pages/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Feed', () => {
  return {
    Feed: () => <div data-testid="categories">Feed</div>,
  };
});

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

jest.mock('@contexts/SearchProvider', () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('HomePage Component', () => {
  it('Renders homepage.', () => {
    render(
      <DesktopMenuProvider>
        <HomePage />
      </DesktopMenuProvider>,
    );
    expect(screen.getAllByText('100 Letters Project').length).toBe(1);
    expect(
      screen.getByText('© 2025 100 Letters Project.'),
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
