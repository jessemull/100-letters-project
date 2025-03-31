'use client';

import ComingSoon from './ComingSoon';
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  return (
    <div
      className="p-8 flex justify-center items-center w-full"
      style={{
        height: 'calc(100vh - 56px - 36px)',
      }}
    >
      <ComingSoon />
    </div>
  );
};

export default Login;
