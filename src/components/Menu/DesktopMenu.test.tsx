import { render, fireEvent, screen } from '@testing-library/react';
import DesktopMenu from '@components/Menu/DesktopMenu';

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

describe('DesktopMenu', () => {
  it('Calls setCollapsed when toggle button is clicked.', () => {
    const setCollapsed = jest.fn();
    render(<DesktopMenu collapsed={false} setCollapsed={setCollapsed} />);

    const toggleButton = screen.getByLabelText('Toggle Menu');
    fireEvent.click(toggleButton);

    expect(setCollapsed).toHaveBeenCalledWith(true);
  });
});
