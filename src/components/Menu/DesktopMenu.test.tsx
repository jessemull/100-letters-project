import DesktopMenu from '@components/Menu/DesktopMenu';
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

describe('DesktopMenu', () => {
  it('Calls setCollapsed when toggle button is clicked.', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const toggleButton = screen.getByLabelText('Toggle Menu');
    fireEvent.click(toggleButton);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });

  it('Calls setCollapsed(true) when clicking outside the menu.', () => {
    const setCollapsed = jest.fn();
    render(
      <>
        <DesktopMenu collapsed={false} setCollapsed={setCollapsed} />
        <div data-testid="outside-element">Outside Element</div>
      </>,
    );

    const outsideElement = screen.getByTestId('outside-element');
    fireEvent.mouseDown(outsideElement);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });
});
