'use client';

import cookies from 'js-cookie';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Amplify } from 'aws-amplify';
import { showToast } from '@components/Form';
import {
  getCurrentUser,
  fetchAuthSession,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
} from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
      userPoolClientId: process.env
        .NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID as string,
    },
  },
});

const COOKIE_KEY = '100_letters_cognito_access_token';
const DEFAULT_ERROR_MESSAGE = 'Error signing in. Please try again.';

export interface AuthContextType {
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  user: any | null;
  signIn: (
    username: string,
    password: string,
  ) => Promise<{ isSignedIn: boolean }>;
  signOut: () => void;
}

export const defaultSignIn = async () => ({ isSignedIn: false });
export const defaultSignOut = () => {};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  isLoggedIn: false,
  user: null,
  signIn: defaultSignIn,
  signOut: defaultSignOut,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  const resetAuthState = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    cookies.remove(COOKIE_KEY);
  };

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch {
      return null;
    }
  }, []);

  const initializeSession = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error('Missing access token!');

      setUser(currentUser);
      setToken(accessToken);
      setIsLoggedIn(true);
      cookies.set(COOKIE_KEY, accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });
    } catch {
      resetAuthState();
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const signIn = async (
    username: string,
    password: string,
  ): Promise<{ isSignedIn: boolean }> => {
    const { isSignedIn } = await amplifySignIn({ username, password });
    if (!isSignedIn) {
      resetAuthState();
      throw new Error(DEFAULT_ERROR_MESSAGE);
    }
    await initializeSession();
    return { isSignedIn };
  };

  const signOut = async () => {
    await amplifySignOut();
    resetAuthState();
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(
      async () => {
        try {
          const newToken = await getAccessToken();

          if (!newToken) throw new Error('No token!');

          if (newToken !== token) {
            setToken(newToken);
            cookies.set(COOKIE_KEY, newToken, {
              expires: 1,
              secure: true,
              sameSite: 'Strict',
            });
          }
        } catch {
          setTimeout(() => {
            resetAuthState();
          }, 100);
          router.push('/login');
          showToast({
            message: 'User session has expired. Please log in again!',
            type: 'error',
          });
        }
      },
      55 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [getAccessToken, router, token, isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ token, loading, isLoggedIn, user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
