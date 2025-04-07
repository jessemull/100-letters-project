'use client';

import React, { useEffect } from 'react';
import Progress from './Progress';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useData } from '../hooks/useData';

const Login = () => {
  const router = useRouter();
  const { isLoggedIn, loading: authenticating, token } = useAuth();

  const { data: correspondences, loading: loadingCorrespondences } = useData({
    route: '/correspondence',
    token,
  });

  const { data: letters, loading: loadingLetters } = useData({
    route: '/letter',
    token,
  });

  const { data: recipients, loading: loadingRecipients } = useData({
    route: '/recipient',
    token,
  });

  useEffect(() => {
    if (!isLoggedIn && !authenticating) {
      router.push('/403');
    }
  }, [authenticating, isLoggedIn, router]);

  return (
    <div
      className="p-8 flex justify-center items-center w-full"
      style={{
        height: 'calc(100vh - 56px - 36px)',
      }}
    >
      {!loadingLetters && !loadingRecipients && !loadingCorrespondences ? (
        <div>
          <div>
            Successfully loaded <strong>correspondence</strong>,{' '}
            <strong>recipients</strong> and <strong>letters</strong>:
          </div>
          <div>
            There are <strong>{correspondences.length}</strong> correspondences.
          </div>
          <div>
            There are <strong>{recipients.length}</strong> recipients.
          </div>
          <div>
            There are <strong>{letters.length}</strong> letters.
          </div>
        </div>
      ) : (
        <Progress size={16} />
      )}
    </div>
  );
};

export default Login;
