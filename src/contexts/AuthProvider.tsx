'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Amplify } from 'aws-amplify';
import { AuthSession } from '@aws-amplify/core';
import {
  getCurrentUser,
  fetchAuthSession,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  JWT,
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
  idToken: string | null;
  isLoggedIn: boolean;
  user: any | null;
  signIn: (
    username: string,
    password: string,
  ) => Promise<{ isSignedIn: boolean }>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  idToken: null,
  isLoggedIn: false,
  user: null,
  signIn: async () => Promise.resolve({ isSignedIn: false }),
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        const session = await fetchAuthSession();
        const token = session?.tokens?.idToken?.toString();
        setIdToken(token || null);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setIdToken(null);
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  const signIn = async (
    username: string,
    password: string,
  ): Promise<{ isSignedIn: boolean }> => {
    const { isSignedIn } = await amplifySignIn({ username, password });

    if (!isSignedIn) {
      throw new Error(DEFAULT_ERROR_MESSAGE);
    }

    const user = await getCurrentUser();
    const session: AuthSession = await fetchAuthSession();

    if (session) {
      setUser(user);
      setIdToken(session?.tokens?.idToken?.toString() || null);
      setIsLoggedIn(true);
    }

    return { isSignedIn };
  };

  const signOut = () => {
    amplifySignOut();
    setIsLoggedIn(false);
    setUser(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ idToken, isLoggedIn, user, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
