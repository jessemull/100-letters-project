'use client';

import React from 'react';
import { render, act, screen } from '@testing-library/react';
import {
  AuthContext,
  AuthProvider,
  defaultSignIn,
  defaultSignOut,
  useAuth,
  getSession,
  startSessionRefreshInterval,
} from '@contexts/AuthProvider';
import cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { showToast } from '@components/Form';

// Avoid typescript mock errors.

const { __mocks__ } = require('amazon-cognito-identity-js');

const { mSession, mUser, mUserPool } = __mocks__;

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('@components/Form', () => ({
  showToast: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const TestComponent = () => {
  const { isLoggedIn, loading, signIn, signOut, token } = useAuth();
  return (
    <div>
      <span data-testid="status">{isLoggedIn ? 'LoggedIn' : 'LoggedOut'}</span>
      <span data-testid="loading">{loading ? 'Loading' : 'Loaded'}</span>
      <span data-testid="token">{token}</span>
      <button onClick={() => signIn('user', 'pass')}>SignIn</button>
      <button onClick={() => signOut()}>SignOut</button>
    </div>
  );
};

describe('AuthProvider', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push });

    mUserPool.getCurrentUser.mockReturnValue(mUser);
    mUser.getSession.mockImplementation((cb: any) => cb(null, mSession));

    const { CognitoUser } = require('amazon-cognito-identity-js');

    CognitoUser.mockImplementation(() => ({
      authenticateUser: (_authDetails: unknown, callbacks: any) =>
        callbacks.onSuccess(mSession),
      signOut: jest.fn(),
    }));

    mSession.getAccessToken = () => ({
      getJwtToken: () => 'fake-jwt-token',
    });
  });

  it('Initializes session successfully.', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    expect(screen.getByTestId('status')).toHaveTextContent('LoggedIn');
    expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
    expect(screen.getByTestId('token')).toHaveTextContent('fake-jwt-token');
    expect(cookies.set).toHaveBeenCalled();
  });

  it('Handles missing user during init.', async () => {
    mUserPool.getCurrentUser.mockReturnValue(null as any);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    expect(screen.getByTestId('status')).toHaveTextContent('LoggedOut');
    expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
    expect(cookies.remove).toHaveBeenCalled();
  });

  it('Signs in correctly and stores token.', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    await act(async () => {
      screen.getByText('SignIn').click();
    });

    expect(screen.getByTestId('status')).toHaveTextContent('LoggedIn');
    expect(cookies.set).toHaveBeenCalled();
  });

  it('Handles sign-in failure and uses default error.', async () => {
    const { CognitoUser } = require('amazon-cognito-identity-js');

    CognitoUser.mockImplementation(() => ({
      authenticateUser: (_authDetails: unknown, callbacks: any) =>
        callbacks.onFailure(null),
      signOut: jest.fn(),
    }));

    let signInFunc: (
      username: string,
      password: string,
    ) => Promise<{ isSignedIn: boolean }> = () =>
      new Promise(() => ({ isSignedIn: false }));

    const HookCapture = () => {
      const auth = useAuth();
      signInFunc = auth.signIn;
      return null;
    };

    await act(async () => {
      render(
        <AuthProvider>
          <HookCapture />
        </AuthProvider>,
      );
    });

    await act(async () => {
      await expect(signInFunc('', '')).rejects.toThrow(
        'Error signing in. Please try again.',
      );
    });

    expect(cookies.remove).toHaveBeenCalled();
  });

  it('Signs out and clears state.', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    mUser.signOut = jest.fn();

    await act(async () => {
      screen.getByText('SignOut').click();
      jest.advanceTimersByTime(120);
    });

    expect(mUser.signOut).toHaveBeenCalled();
    expect(cookies.remove).toHaveBeenCalled();
    expect(screen.getByTestId('status')).toHaveTextContent('LoggedOut');
  });

  it('Has correct default exports for signIn, signOut, and AuthContext.', async () => {
    const signInResult = await defaultSignIn();
    expect(signInResult).toEqual({ isSignedIn: false });
    expect(defaultSignOut).not.toThrow();
    expect(AuthContext).toBeDefined();
  });

  it('Rejects when getSession callback returns err, null session, or invalid session.', async () => {
    const userWithErr = {
      getSession: jest.fn((cb: any) => cb(new Error('Session error'), null)),
    };
    const userWithNullSession = {
      getSession: jest.fn((cb: any) => cb(null, null)),
    };
    const invalidSession = {
      isValid: jest.fn(() => false),
    };
    const userWithInvalidSession = {
      getSession: jest.fn((cb: any) => cb(null, invalidSession)),
    };

    await expect(getSession(userWithErr as any)).rejects.toThrow(
      'Session error',
    );
    await expect(getSession(userWithNullSession as any)).rejects.toThrow(
      'Invalid session',
    );
    await expect(getSession(userWithInvalidSession as any)).rejects.toThrow(
      'Invalid session',
    );
  });

  it('Interval throws no token message.', async () => {
    mUser.getSession.mockImplementation((cb: any) =>
      cb(null, {
        getAccessToken: () => ({
          getJwtToken: () => null,
        }),
        isValid: () => true,
      }),
    );

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );
    });

    await act(() => {
      jest.runOnlyPendingTimers();
      return Promise.resolve();
    });

    expect(push).toHaveBeenCalledWith('/login');
    expect(showToast).toHaveBeenCalled();
  });
});

describe('startSessionRefreshInterval', () => {
  const resetAuthState = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it('Throws error if no user is provided.', async () => {
    startSessionRefreshInterval({
      isLoggedIn: true,
      user: null,
      token: 'abc',
      setToken: jest.fn(),
      resetAuthState,
      router: useRouter(),
    });

    await act(() => {
      jest.advanceTimersByTime(55 * 60 * 1000);
      return Promise.resolve();
    });

    expect(push).toHaveBeenCalledWith('/login');
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('expired') }),
    );
  });

  it('Updates token if new token differs.', async () => {
    const setToken = jest.fn();

    const user = {
      getSession: (cb: any) =>
        cb(null, {
          getAccessToken: () => ({
            getJwtToken: () => 'new-token',
          }),
          isValid: () => true,
        }),
    };

    startSessionRefreshInterval({
      isLoggedIn: true,
      user: user as any,
      token: 'old-token',
      setToken,
      resetAuthState,
      router: useRouter(),
    });

    await act(() => {
      jest.runOnlyPendingTimers();
      return Promise.resolve();
    });

    expect(setToken).toHaveBeenCalledWith('new-token');
    expect(cookies.set).toHaveBeenCalledWith(
      expect.anything(),
      'new-token',
      expect.anything(),
    );
  });

  it('Triggers catch block and resets auth state on thrown error.', async () => {
    const setToken = jest.fn();
    const user = {
      getSession: () => {
        throw new Error('oops');
      },
    };

    startSessionRefreshInterval({
      isLoggedIn: true,
      user: user as any,
      token: 'existing-token',
      setToken,
      resetAuthState,
      router: useRouter(),
    });

    await act(() => {
      jest.runOnlyPendingTimers();
      return Promise.resolve();
    });

    expect(resetAuthState).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/login');
    expect(showToast).toHaveBeenCalled();
  });
});
