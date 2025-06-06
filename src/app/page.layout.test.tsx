import PageLayout from './page.layout';
import { DesktopMenuContext } from '@contexts/DesktopMenuProvider';
import { render, screen } from '@testing-library/react';

jest.mock('@contexts/SearchProvider', () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
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
  it('Collapses menu.', () => {
    render(
      <DesktopMenuContext.Provider
        value={{ collapsed: false, setCollapsed: jest.fn() }}
      >
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      </DesktopMenuContext.Provider>,
    );
    const sidebar = screen.getByTestId('menu-width');
    expect(sidebar).toHaveClass('w-80');
  });
});
