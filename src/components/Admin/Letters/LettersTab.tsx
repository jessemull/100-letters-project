'use client';

import React, { useEffect, useState } from 'react';
import { ConfirmationModal, Progress, showToast } from '@components/Form';
import { DeleteLetterResponse, GetLettersResponse } from '@ts-types/letter';
import { LetterItem } from '@components/Admin';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { onLetterUpdate } from '@util/cache';
import { CorrespondenceLetterParams } from '@ts-types/correspondence';
import { useInView } from 'react-intersection-observer';

const LettersTab: React.FC = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [letterId, setLetterId] = useState('');
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);

  const router = useRouter();
  const { token } = useAuth();

  const { data, fetchMore, isLoading, loadingMore } =
    useSWRQuery<GetLettersResponse>({
      path: '/letter',
      token,
    });

  const { isLoading: isDeleting, mutate } = useSWRMutation<
    {},
    DeleteLetterResponse,
    CorrespondenceLetterParams
  >({
    cache: [{ key: '/letter', onUpdate: onLetterUpdate }],
    method: 'DELETE',
    token,
    onSuccess: () => {
      showToast({
        message: 'Letter deleted successfully!',
        type: 'success',
      });
    },
    onError: ({ error }) => {
      showToast({
        message: error,
        type: 'error',
      });
    },
  });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !loadingMore && lastEvaluatedKey !== null) {
      fetchMore(`/letter?lastEvaluatedKey=${lastEvaluatedKey}`);
    }
  }, [inView, lastEvaluatedKey, fetchMore, loadingMore]);

  useEffect(() => {
    setLastEvaluatedKey(data?.lastEvaluatedKey || null);
  }, [data]);

  const onEdit = (id: string) => {
    router.push(`/admin/letter?letterId=${id}`);
  };

  const onDelete = (id: string) => {
    setLetterId(id);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const onConfirmDelete = () => {
    closeConfirmationModal();
    mutate({ path: `/letter/${letterId}`, params: { letterId } });
  };

  return (
    <>
      {isLoading || isDeleting ? (
        <div className="w-full flex-grow flex items-center justify-center py-24 min-h-[calc(100vh-475px)]">
          <Progress color="white" size={16} />
        </div>
      ) : (
        <ul className="grid gap-4">
          {data?.data.map((item, idx) => (
            <li key={idx} ref={idx === data?.data.length - 1 ? ref : undefined}>
              <LetterItem data={item} onDelete={onDelete} onEdit={onEdit} />
            </li>
          ))}
          {loadingMore && (
            <div className="w-full flex justify-center items-center">
              <Progress color="white" size={16} />
            </div>
          )}
          {data?.data.length === 0 && (
            <li className="text-center text-gray-500">No results found.</li>
          )}
        </ul>
      )}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={onConfirmDelete}
        title="Delete Letter"
      />
    </>
  );
};

export default LettersTab;
