import CategoryPage from '@pages/category/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Feed', () => {
  return {
    Feed: () => <div data-testid="categories">Feed</div>,
    Search: () => <div data-testid="search">Feed</div>,
  };
});

jest.mock('@hooks/useSearch');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('CategoryPage Component', () => {
  it('Renders categories.', () => {
    render(
      <DesktopMenuProvider>
        <CategoryPage />
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
        <CategoryPage />
      </DesktopMenuProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
