import React from 'react';
import {
  AuthContext,
  AuthProvider,
  defaultSignIn,
  defaultSignOut,
  useAuth,
} from '@contexts/AuthProvider';
import {
  getCurrentUser,
  fetchAuthSession,
  signIn as amplifySignIn,
} from '@aws-amplify/auth';
import { render, screen, waitFor, act } from '@testing-library/react';

jest.mock('@aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
  fetchAuthSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

const mockUser = { username: 'testUser' };
const mockSession = {
  tokens: {
    accessToken: {
      toString: jest.fn(() => 'mockIdToken'),
    },
  },
};

const TestComponent = () => {
  const { isLoggedIn, token, user, signIn, signOut } = useAuth();

  const handleClick = async () => {
    try {
      await signIn('testUser', 'password');
    } catch (e) {} // eslint-disable-line unused-imports/no-unused-vars
  };

  return (
    <div>
      <div data-testid="access-token">{token || 'No Token'}</div>
      <div data-testid="is-logged-in">{isLoggedIn ? 'Yes' : 'No'}</div>
      <div data-testid="user">{user ? user.username : 'No User'}</div>
      <button onClick={handleClick}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Provides default values when unauthenticated.', async () => {
    (getCurrentUser as jest.Mock).mockRejectedValue(new Error('Failed'));
    (fetchAuthSession as jest.Mock).mockRejectedValue(new Error('Failed'));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    expect(screen.getByTestId('access-token')).toHaveTextContent('No Token');
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  it('Sets user and accessToken when authenticated on mount.', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAuthSession as jest.Mock).mockResolvedValue(mockSession);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('access-token')).toHaveTextContent(
        'mockIdToken',
      );
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent('testUser');
    });
  });

  it('Sets accessToken to null if fetching session fails.', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAuthSession as jest.Mock).mockRejectedValue(new Error('Failed'));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    expect(screen.getByTestId('access-token')).toHaveTextContent('No Token');
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  it('Sets accessToken to null if fetching session returns bad data.', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAuthSession as jest.Mock).mockResolvedValue({});

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    expect(screen.getByTestId('access-token')).toHaveTextContent('No Token');
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  it('Handles sign-in correctly.', async () => {
    (amplifySignIn as jest.Mock).mockResolvedValue({ isSignedIn: true });
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAuthSession as jest.Mock).mockResolvedValue(mockSession);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByText('Sign In').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('access-token')).toHaveTextContent(
        'mockIdToken',
      );
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent('testUser');
    });
  });

  it('Handles bad data on sign-in correctly.', async () => {
    (amplifySignIn as jest.Mock).mockResolvedValue({ isSignedIn: true });
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAuthSession as jest.Mock).mockResolvedValue({});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByText('Sign In').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('access-token')).toHaveTextContent('No Token');
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });

  it('Handles sign-in failure.', async () => {
    (amplifySignIn as jest.Mock).mockResolvedValue({ isSignedIn: false });
    (getCurrentUser as jest.Mock).mockResolvedValue({});
    (fetchAuthSession as jest.Mock).mockResolvedValue({});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByText('Sign In').click();
    });

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('access-token')).toHaveTextContent(
          'No Token',
        );
      });
    });
  });

  it('Handles and sets default values.', async () => {
    const signIn = await defaultSignIn();
    const signOut = defaultSignOut();
    expect(signIn).toEqual({ isSignedIn: false });
    expect(signOut).toBeUndefined();
    expect(AuthContext).toBeDefined();
  });

  it('Handles sign-out correctly.', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAuthSession as jest.Mock).mockResolvedValue(mockSession);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('access-token')).toHaveTextContent(
        'mockIdToken',
      );
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent('testUser');
    });

    (getCurrentUser as jest.Mock).mockResolvedValue(null);
    (fetchAuthSession as jest.Mock).mockResolvedValue({});

    await act(async () => {
      screen.getByText('Sign Out').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('access-token')).toHaveTextContent('No Token');
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });

  it('Handles authentication check failure.', async () => {
    (getCurrentUser as jest.Mock).mockRejectedValue(new Error('Failed'));
    (fetchAuthSession as jest.Mock).mockRejectedValue(new Error('Failed'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('access-token')).toHaveTextContent('No Token');
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });
});
