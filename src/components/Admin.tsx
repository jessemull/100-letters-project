'use client';

import React, { useEffect } from 'react';
import Progress from './Progress';
import {
  GetCorrespondencesResponse,
  GetLettersResponse,
  GetRecipientsResponse,
} from 'src/types';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSWRWithAuth } from '../hooks';

const Admin = () => {
  const router = useRouter();
  const { isLoggedIn, loading: authenticating, token } = useAuth();

  const { data: correspondences, isLoading: loadingCorrespondences } =
    useSWRWithAuth<GetCorrespondencesResponse>('/correspondence', token);

  const { data: letters, isLoading: loadingLetters } =
    useSWRWithAuth<GetRecipientsResponse>('/recipient', token);

  const { data: recipients, isLoading: loadingRecipients } =
    useSWRWithAuth<GetLettersResponse>('/letter', token);

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
      {!loadingCorrespondences && !loadingRecipients && !loadingLetters ? (
        <div>
          <div>
            Successfully loaded <strong>correspondence</strong>,{' '}
            <strong>recipients</strong> and <strong>letters</strong>:
          </div>
          <div>
            There are <strong>{correspondences?.data.length}</strong>{' '}
            correspondences.
          </div>
          <div>
            There are <strong>{recipients?.data.length}</strong> recipients.
          </div>
          <div>
            There are <strong>{letters?.data.length}</strong> letters.
          </div>
        </div>
      ) : (
        <Progress size={16} />
      )}
    </div>
  );
};

export default Admin;
