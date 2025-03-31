import Header from './Header';
import { axe } from 'jest-axe';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { useAuth } from '../contexts/AuthProvider';

jest.mock('../contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

describe('Header Component', () => {
  it('Renders header with logged-in state.', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      getIdToken: jest.fn(),
      isLoggedIn: true,
      signOut: jest.fn(),
    });

    await act(async () => {
      render(<Header />);
    });

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('100 Letters Project')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('Renders header with logged-out state.', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      getIdToken: jest.fn(),
      isLoggedIn: false,
      signOut: jest.fn(),
    });

    await act(async () => {
      render(<Header />);
    });

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('100 Letters Project')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByTestId('login-icon')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      getIdToken: jest.fn(),
      isLoggedIn: false,
      signOut: jest.fn(),
    });

    await act(async () => {
      const { container } = render(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('Opens menu when the button is clicked (on mobile).', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      getIdToken: jest.fn(),
      isLoggedIn: false,
      signOut: jest.fn(),
    });

    render(<Header />);
    const menuButton = screen.getByLabelText('Open Menu');
    expect(menuButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(menuButton);
    });
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  it('Logs out when the logout icon is clicked.', async () => {
    const signOutMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      getIdToken: jest.fn(),
      isLoggedIn: true,
      signOut: signOutMock,
    });

    render(<Header />);
    const logoutIcon = screen.getByTestId('logout-icon');
    expect(logoutIcon).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(logoutIcon);
    });

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it('Handles error when signOut fails.', async () => {
    const signOutMock = jest
      .fn()
      .mockRejectedValue(new Error('Sign out failed'));
    (useAuth as jest.Mock).mockReturnValue({
      getIdToken: jest.fn(),
      isLoggedIn: true,
      signOut: signOutMock,
    });

    render(<Header />);
    const logoutIcon = screen.getByTestId('logout-icon');
    expect(logoutIcon).toBeInTheDocument();

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    await act(async () => {
      fireEvent.click(logoutIcon);
    });

    expect(signOutMock).toHaveBeenCalledTimes(1);

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error signing out: ',
      expect.any(Error),
    );

    consoleErrorMock.mockRestore();
  });
});
