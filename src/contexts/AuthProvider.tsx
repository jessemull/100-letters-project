'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import cookies from 'js-cookie';
import { AuthContextType } from '@ts-types/context';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { authCookieKey, defaultAuthError } from '@constants/context';
import { showToast } from '@components/Form';
import { useRouter } from 'next/navigation';

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID as string,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID as string,
};

const userPool = new CognitoUserPool(poolData);

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

const getCurrentUser = (): Promise<CognitoUser | null> => {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    resolve(user || null);
  });
};

export const getSession = (user: CognitoUser): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    user.getSession((err: any, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) {
        reject(err || new Error('Invalid session'));
      } else {
        resolve(session);
      }
    });
  });
};

export const startSessionRefreshInterval = ({
  isLoggedIn,
  user,
  token,
  setToken,
  resetAuthState,
  router,
}: {
  isLoggedIn: boolean;
  user: CognitoUser | null;
  token: string | null;
  setToken: (token: string) => void;
  resetAuthState: () => void;
  router: ReturnType<typeof useRouter>;
}) => {
  if (!isLoggedIn) return undefined;

  const interval = setInterval(
    async () => {
      try {
        if (!user) throw new Error('No user for session refresh');

        const session = await getSession(user);
        const newToken = session.getAccessToken().getJwtToken();

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
        setTimeout(() => resetAuthState(), 100);
        router.push('/login');
        showToast({
          message: 'User session has expired. Please log in again!',
          type: 'error',
        });
      }
    },
    55 * 60 * 1000,
  );

  return interval;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<CognitoUser | null>(null);

  const router = useRouter();

  const resetAuthState = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    cookies.remove(authCookieKey);
  };

  const initializeSession = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error('No current user');

      const session = await getSession(currentUser);
      const accessToken = session.getAccessToken().getJwtToken();

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
  }, []);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const signIn = async (
    username: string,
    password: string,
  ): Promise<{ isSignedIn: boolean }> => {
    return new Promise((resolve, reject) => {
      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: async (session) => {
          const accessToken = session.getAccessToken().getJwtToken();
          setUser(cognitoUser);
          setToken(accessToken);
          setIsLoggedIn(true);
          cookies.set(authCookieKey, accessToken, {
            expires: 1,
            secure: true,
            sameSite: 'Strict',
          });
          resolve({ isSignedIn: true });
        },
        onFailure: (err) => {
          resetAuthState();
          reject(err || new Error(defaultAuthError));
        },
      });
    });
  };

  const signOut = async () => {
    if (user) user.signOut();
    setTimeout(() => {
      resetAuthState();
    }, 100);
  };

  useEffect(() => {
    const interval = startSessionRefreshInterval({
      isLoggedIn,
      user,
      token,
      setToken,
      resetAuthState,
      router,
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, token, isLoggedIn, router]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loading, signIn, signOut, token, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
