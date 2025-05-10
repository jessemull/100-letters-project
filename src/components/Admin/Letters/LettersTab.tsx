'use client';

import React, { useEffect, useState } from 'react';
import { ConfirmationModal, Progress, showToast } from '@components/Form';
import {
  DeleteLetterParams,
  DeleteLetterResponse,
  GetLettersResponse,
} from '@ts-types/letter';
import { LetterItem } from '@components/Admin';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { useInView } from 'react-intersection-observer';
import {
  correspondenceByIdDeleteUpdate,
  correspondencesDeleteUpdate,
  letterByIdDeleteUpdate,
  lettersDeleteUpdate,
} from '@util/cache';

interface Props {
  search: string;
}

const LettersTab: React.FC<Props> = ({ search }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [letterId, setLetterId] = useState('');
  const [correspondenceId, setCorrespondenceId] = useState('');
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);

  const router = useRouter();
  const { token } = useAuth();

  const { data, fetchMore, isLoading, loadingMore } =
    useSWRQuery<GetLettersResponse>({
      path: search ? `/letter?search=${search}` : '/letter',
      token,
    });

  const { isLoading: isDeleting, mutate } = useSWRMutation<
    {},
    DeleteLetterResponse,
    DeleteLetterParams
  >({
    cache: [
      { key: '/correspondence', onUpdate: correspondencesDeleteUpdate },
      {
        key: `/correspondence/${correspondenceId}`,
        onUpdate: correspondenceByIdDeleteUpdate,
      },
      { key: '/letter', onUpdate: lettersDeleteUpdate },
      { key: `/letter/${letterId}`, onUpdate: letterByIdDeleteUpdate },
    ],
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
      fetchMore(
        search
          ? `/letter?lastEvaluatedKey=${lastEvaluatedKey}&search=${search}`
          : `/letter?lastEvaluatedKey=${lastEvaluatedKey}`,
      );
    }
  }, [inView, lastEvaluatedKey, fetchMore, loadingMore, search]);

  useEffect(() => {
    setLastEvaluatedKey(data?.lastEvaluatedKey || null);
  }, [data]);

  const onEdit = (id: string) => {
    router.push(`/admin/letter?letterId=${id}`);
  };

  const onDelete = (letterId: string, corresondenceId: string) => {
    setCorrespondenceId(corresondenceId);
    setLetterId(letterId);
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
