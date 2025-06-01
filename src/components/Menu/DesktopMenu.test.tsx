import DesktopMenu from '@components/Menu/DesktopMenu';
import { axe } from 'jest-axe';
import { render, fireEvent, screen } from '@testing-library/react';

jest.mock('@hooks/useSearch', () => ({
  useSearch: jest.fn(() => []),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@contexts/AuthProvider', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    signOut: jest.fn(),
  }),
}));

jest.mock('@components/Menu/RecipientSearch', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="mock-recipient-search" onClick={onClick}>
      Recipient Search
    </button>
  ),
}));

jest.mock('@components/Menu/LetterSearch', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="mock-letter-search" onClick={onClick}>
      Letter Search
    </button>
  ),
}));

jest.mock('@components/Menu/CorrespondenceSearch', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="mock-correspondence-search" onClick={onClick}>
      Correspondence Search
    </button>
  ),
}));

jest.mock('@components/Menu/MenuNavItems', () => ({
  __esModule: true,
  default: ({ onNavigate }: { onNavigate: () => void }) => (
    <button data-testid="mock-menu-nav-items" onClick={onNavigate}>
      Menu Nav Items
    </button>
  ),
}));

describe('DesktopMenu Component', () => {
  it('Calls setCollapsed when toggle button is clicked.', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const toggleButton = screen.getByLabelText('Toggle Menu');
    fireEvent.click(toggleButton);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });

  it('Calls setCollapsed(true) when RecipientSearch is clicked.', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const recipientSearch = screen.getByTestId('mock-recipient-search');
    fireEvent.click(recipientSearch);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });

  it('Calls setCollapsed(true) when LetterSearch is clicked.', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const letterSearch = screen.getByTestId('mock-letter-search');
    fireEvent.click(letterSearch);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });

  it('Calls setCollapsed(true) when CorrespondenceSearch is clicked.', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const correspondenceSearch = screen.getByTestId(
      'mock-correspondence-search',
    );
    fireEvent.click(correspondenceSearch);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });

  it('Calls setCollapsed(true) when MenuNavItems onNavigate is called.', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const menuNavItems = screen.getByTestId('mock-menu-nav-items');
    fireEvent.click(menuNavItems);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <DesktopMenu collapsed={false} setCollapsed={jest.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
