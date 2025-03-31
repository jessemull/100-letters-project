'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthProvider';

const Login = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  return (
    <div
      className="p-8 flex justify-center items-center w-full"
      style={{
        height: 'calc(100vh - 56px - 36px)',
      }}
    >
      Coming soon...
    </div>
  );
};

export default Login;
