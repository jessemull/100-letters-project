import { render, fireEvent, screen } from '@testing-library/react';
import DesktopMenu from '@components/Menu/DesktopMenu';

jest.mock('@contexts/AuthProvider', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    signOut: jest.fn(),
  }),
}));

describe('DesktopMenu', () => {
  it('calls setCollapsed when toggle button is clicked', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const toggleButton = screen.getByLabelText('Toggle Menu');
    fireEvent.click(toggleButton);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });
});
