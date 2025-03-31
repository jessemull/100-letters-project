'use client';

import React, {
  ReactNode,
  createContext,
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

export interface AuthContextType {
  getIdToken: () => Promise<string | null>;
  isLoggedIn: boolean;
  user: any | null;
  signIn: (
    username: string,
    password: string,
  ) => Promise<{ isSignedIn: boolean } | null>;
  signOut: () => void;
}

export const defaultGetIdToken = async () => Promise.resolve(null);
export const defaultSignIn = async () => Promise.resolve(null);
export const defaultSignOut = () => null;

export const AuthContext = createContext<AuthContextType>({
  getIdToken: defaultGetIdToken,
  isLoggedIn: false,
  user: null,
  signIn: defaultSignIn,
  signOut: defaultSignOut,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const getIdToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      return session?.tokens?.idToken?.toString() || null;
    } catch (error) {
      return null;
    }
  };

  const signIn = async (
    username: string,
    password: string,
  ): Promise<{ isSignedIn: boolean }> => {
    const { isSignedIn } = await amplifySignIn({ username, password });

    if (!isSignedIn) {
      throw new Error(DEFAULT_ERROR_MESSAGE);
    }

    const user = await getCurrentUser();
    setUser(user);
    setIsLoggedIn(true);

    return { isSignedIn };
  };

  const signOut = async () => {
    await amplifySignOut();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ getIdToken, isLoggedIn, signIn, signOut, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
