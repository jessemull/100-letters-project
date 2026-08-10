import PageLayout from './page.layout';
import { DesktopMenuContext } from '@contexts/DesktopMenuProvider';
import { render, screen } from '@testing-library/react';

jest.mock('@contexts/SearchProvider', () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useSearchData: () => ({
    error: null,
    loading: false,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@hooks/useSearch', () => ({
  useSearch: jest.fn(() => []),
}));

jest.mock('@components/Menu/RecipientSearch', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-recipient-search">Recipient Search</div>
  ),
}));

jest.mock('@components/Menu/LetterSearch', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-letter-search">Letter Search</div>,
}));

jest.mock('@components/Menu/CorrespondenceSearch', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-correspondence-search">Correspondence Search</div>
  ),
}));

describe('PageLayout Component', () => {
  it('Renders an expanded desktop sidebar width.', () => {
    render(
      <DesktopMenuContext.Provider
        value={{ collapsed: false, setCollapsed: jest.fn() }}
      >
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      </DesktopMenuContext.Provider>,
    );
    expect(screen.getByTestId('menu-width')).toHaveClass('w-80');
  });

  it('Puts the footer inside the main scroller, not viewport chrome.', () => {
    render(
      <DesktopMenuContext.Provider
        value={{ collapsed: true, setCollapsed: jest.fn() }}
      >
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      </DesktopMenuContext.Provider>,
    );

    const sidebar = screen.getByTestId('menu-width');
    expect(sidebar).toHaveClass('w-12');
    expect(sidebar).not.toHaveClass('fixed');
    expect(screen.getByText(/© 2025 100 Letters Project/i)).toBeInTheDocument();
  });
});
