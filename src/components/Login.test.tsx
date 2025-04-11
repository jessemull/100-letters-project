import Login from './Login';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { axe } from 'jest-axe';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';

jest.mock('../contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Login Component', () => {
  const mockPush = jest.fn();
  const signInMock = jest.fn();
  const signOutMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      signIn: signInMock,
      signOut: signOutMock,
    });
  });

  it('Renders the login form correctly.', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('Toggles password visibility when clicking on the icon.', async () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText('Password');
    const iconEnd = screen.getByTestId('password-text-input-icon-end');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await act(async () => {
      fireEvent.click(iconEnd);
    });

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('Handles sign in and redirects when successful.', async () => {
    render(<Login />);

    signInMock.mockResolvedValueOnce(undefined);

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signInButton = screen.getByText('Sign In');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(signInButton);
    });

    expect(signInMock).toHaveBeenCalledWith('testuser', 'password123');

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('Displays error message when sign in fails.', async () => {
    render(<Login />);

    signInMock.mockRejectedValueOnce(new Error('Invalid credentials'));

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signInButton = screen.getByText('Sign In');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    await act(async () => {
      fireEvent.click(signInButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('Displays default error message when sign in fails and no message is returned.', async () => {
    render(<Login />);

    signInMock.mockRejectedValueOnce({});

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signInButton = screen.getByText('Sign In');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    await act(async () => {
      fireEvent.click(signInButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Error signing in. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('Enables the sign-in button only when both username and password are provided.', () => {
    render(<Login />);

    const signInButton = screen.getByText('Sign In');

    expect(signInButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    expect(signInButton).toBeEnabled();
  });

  it('Calls handleCancel and redirects to home when Cancel button is clicked.', async () => {
    render(<Login />);

    const cancelButton = screen.getByText('Cancel');

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('Renders sign-out option when the user is logged in.', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      signIn: signInMock,
      signOut: signOutMock,
    });
    render(<Login />);

    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('Handles sign out successfully.', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      signIn: signInMock,
      signOut: signOutMock,
    });

    render(<Login />);

    const signOutLink = screen.getByText('Sign Out');

    signOutMock.mockResolvedValueOnce(undefined);

    await act(async () => {
      fireEvent.click(signOutLink);
    });

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it('Logs an error when signOut fails.', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      signIn: signInMock,
      signOut: signOutMock,
    });

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    render(<Login />);

    signOutMock.mockRejectedValueOnce(new Error('Sign out failed'));

    const signOutLink = screen.getByText('Sign Out');

    await act(async () => {
      fireEvent.click(signOutLink);
    });

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error signing out: ',
      expect.any(Error),
    );

    consoleErrorMock.mockRestore();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Login />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
