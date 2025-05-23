'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isLoggedIn, loading: authenticating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authenticating && !isLoggedIn) {
      router.replace('/forbidden');
    }
  }, [authenticating, isLoggedIn, router]);

  if (authenticating) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
