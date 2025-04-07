'use client';

import cookies from 'js-cookie';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Amplify } from 'aws-amplify';
import {
  getCurrentUser,
  fetchAuthSession,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
} from '@aws-amplify/auth';

const DEFAULT_ERROR_MESSAGE = 'Error signing in. Please try again.';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
      userPoolClientId: process.env
        .NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID as string,
    },
  },
});

export const defaultSignIn = async () => null;
export const defaultSignOut = () => null;

export interface AuthContextType {
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  user: any | null;
  signIn: (
    username: string,
    password: string,
  ) => Promise<{ isSignedIn: boolean } | null>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  loading: true,
  user: null,
  signIn: defaultSignIn,
  signOut: defaultSignOut,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const reset = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
  };

  const getIdToken = useCallback(async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session?.tokens?.idToken?.toString() || null;
    } catch (error) {
      reset();
      return null;
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const checkAuthStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsLoggedIn(true);
      } catch (error) {
        reset();
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchToken = async () => {
        const idToken = await getIdToken();
        if (idToken) {
          setToken(idToken);
        } else {
          reset();
        }
      };
      fetchToken();
    } else {
      reset();
    }
  }, [isLoggedIn, getIdToken]);

  const signIn = async (
    username: string,
    password: string,
  ): Promise<{ isSignedIn: boolean }> => {
    const { isSignedIn } = await amplifySignIn({ username, password });

    if (!isSignedIn) {
      reset();
      throw new Error(DEFAULT_ERROR_MESSAGE);
    }

    const user = await getCurrentUser();
    setUser(user);
    setIsLoggedIn(true);

    const idToken = await getIdToken();

    if (idToken) {
      cookies.set('100_letters_cognito_id_token', idToken, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });
    } else {
      reset();
    }

    return { isSignedIn };
  };

  const signOut = async () => {
    await amplifySignOut();
    setTimeout(() => {
      reset();
      cookies.remove('100_letters_cognito_id_token');
    }, 200);
  };

  return (
    <AuthContext.Provider
      value={{ token, loading, isLoggedIn, signIn, signOut, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
