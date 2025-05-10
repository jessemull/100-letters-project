'use client';

import React, { useEffect, useState } from 'react';
import { ConfirmationModal, Progress, showToast } from '@components/Form';
import { useAuth } from '@contexts/AuthProvider';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { CorrespondenceItem } from '@components/Admin';
import {
  GetCorrespondencesResponse,
  DeleteCorrespondenceResponse,
} from '@ts-types/correspondence';
import {
  deleteCorrespondenceLetterUpdate,
  deleteCorrespondenceRecipientUpdate,
  deleteCorrespondenceUpdate,
} from '@util/cache';

interface Props {
  search: string;
}

const CorrespondencesTab: React.FC<Props> = ({ search }) => {
  const [correspondenceId, setCorrespondenceId] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);

  const router = useRouter();
  const { token } = useAuth();

  const { data, fetchMore, isLoading, loadingMore } =
    useSWRQuery<GetCorrespondencesResponse>({
      path: search ? `/correspondence?search=${search}` : '/correspondence',
      token,
    });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !loadingMore && lastEvaluatedKey !== null) {
      fetchMore(
        search
          ? `/correspondence?lastEvaluatedKey=${lastEvaluatedKey}&search=${search}`
          : `/correspondence?lastEvaluatedKey=${lastEvaluatedKey}`,
      );
    }
  }, [inView, lastEvaluatedKey, loadingMore, fetchMore, search]);

  const { isLoading: isDeleting, mutate } = useSWRMutation<
    {},
    DeleteCorrespondenceResponse
  >({
    cache: [
      { key: '/correspondence', onUpdate: deleteCorrespondenceUpdate },
      { key: '/letter', onUpdate: deleteCorrespondenceLetterUpdate },
      { key: '/recipient', onUpdate: deleteCorrespondenceRecipientUpdate },
    ],
    method: 'DELETE',
    token,
    onSuccess: () => {
      showToast({
        message: 'Correspondence deleted successfully!',
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

  const onEdit = (id: string) => {
    router.push(`/admin/correspondence?correspondenceId=${id}`);
  };

  const onDelete = (id: string) => {
    setCorrespondenceId(id);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const onConfirmDelete = () => {
    closeConfirmationModal();
    mutate({
      path: `/correspondence/${correspondenceId}`,
      params: { correspondenceId },
    });
  };

  useEffect(() => {
    setLastEvaluatedKey(data?.lastEvaluatedKey || null);
  }, [data]);

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
              <CorrespondenceItem
                data={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
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
        title="Delete Correspondence"
      />
    </>
  );
};

export default CorrespondencesTab;
