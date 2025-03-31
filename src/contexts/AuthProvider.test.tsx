import React, { useEffect, useState } from 'react';
import {
  AuthContext,
  AuthProvider,
  defaultGetIdToken,
  defaultSignIn,
  defaultSignOut,
  useAuth,
} from './AuthProvider';
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
    idToken: {
      toString: jest.fn(() => 'mockIdToken'),
    },
  },
};

const TestComponent = () => {
  const { getIdToken, isLoggedIn, user, signIn, signOut } = useAuth();
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdToken = async () => {
      const token = await getIdToken();
      setIdToken(token);
    };
    fetchIdToken();
  }, [getIdToken, isLoggedIn]);

  const handleClick = async () => {
    try {
      await signIn('testUser', 'password');
    } catch (error) {}
  };

  return (
    <div>
      <div data-testid="id-token">{idToken || 'No Token'}</div>
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

    expect(screen.getByTestId('id-token')).toHaveTextContent('No Token');
    expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  it('Sets user and idToken when authenticated on mount.', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (fetchAuthSession as jest.Mock).mockResolvedValue(mockSession);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('id-token')).toHaveTextContent('mockIdToken');
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent('testUser');
    });
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
      expect(screen.getByTestId('id-token')).toHaveTextContent('mockIdToken');
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent('testUser');
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
        expect(screen.getByTestId('id-token')).toHaveTextContent('No Token');
      });
    });
  });

  it('Handles and sets default values.', async () => {
    const idToken = await defaultGetIdToken();
    const signIn = await defaultSignIn();
    const signOut = defaultSignOut();
    expect(idToken).toBeNull();
    expect(signIn).toBeNull();
    expect(signOut).toBeNull();
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
      expect(screen.getByTestId('id-token')).toHaveTextContent('mockIdToken');
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('Yes');
      expect(screen.getByTestId('user')).toHaveTextContent('testUser');
    });

    (getCurrentUser as jest.Mock).mockResolvedValue(null);
    (fetchAuthSession as jest.Mock).mockResolvedValue({});

    await act(async () => {
      screen.getByText('Sign Out').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('id-token')).toHaveTextContent('No Token');
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
      expect(screen.getByTestId('id-token')).toHaveTextContent('No Token');
      expect(screen.getByTestId('is-logged-in')).toHaveTextContent('No');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });
});
