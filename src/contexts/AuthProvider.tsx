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
import { AuthContextType } from '@ts-types/context';
import { showToast } from '@components/Form';
import {
  getCurrentUser,
  fetchAuthSession,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
} from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { authCookieKey, defaultAuthError } from '@constants/context';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
      userPoolClientId: process.env
        .NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID as string,
    },
  },
});

export const defaultSignIn = async () => ({ isSignedIn: false });
export const defaultSignOut = () => {};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  signIn: defaultSignIn,
  signOut: defaultSignOut,
  token: null,
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const router = useRouter();

  const resetAuthState = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    cookies.remove(authCookieKey);
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
      cookies.set(authCookieKey, accessToken, {
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
      throw new Error(defaultAuthError);
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
            cookies.set(authCookieKey, newToken, {
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
      value={{ isLoggedIn, loading, signIn, signOut, token, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
