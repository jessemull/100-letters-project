'use client';

import React, { useEffect, useState } from 'react';
import {
  DeleteRecipientResponse,
  GetRecipientsResponse,
} from '@ts-types/recipients';
import { ConfirmationModal, showToast } from '@components/Form';
import { Progress } from '@components/Form';
import { RecipientItem } from '@components/Admin';
import { deleteRecipientUpdate } from '@util/cache';
import { useAuth } from '@contexts/AuthProvider';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';

interface Props {
  search: string;
}

const RecipientsTab: React.FC<Props> = ({ search }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);

  const router = useRouter();
  const { token } = useAuth();

  const { data, fetchMore, isLoading, loadingMore } =
    useSWRQuery<GetRecipientsResponse>({
      config: { shouldRetryOnError: false },
      path: search ? `/recipient?search=${search}` : '/recipient',
      token,
    });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { isLoading: isDeleting, mutate } = useSWRMutation<
    {},
    DeleteRecipientResponse
  >({
    cache: [{ key: '/recipient', onUpdate: deleteRecipientUpdate }],
    method: 'DELETE',
    token,
    onSuccess: () => {
      showToast({
        message: 'Recipient deleted successfully!',
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
    router.push(`/admin/recipient?recipientId=${id}`);
  };

  const onDelete = (id: string) => {
    setRecipientId(id);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const onConfirmDelete = () => {
    closeConfirmationModal();
    mutate({ path: `/recipient/${recipientId}`, params: { recipientId } });
  };

  useEffect(() => {
    if (inView && !loadingMore && lastEvaluatedKey !== null) {
      fetchMore(
        search
          ? `/recipient?lastEvaluatedKey=${lastEvaluatedKey}&search=${search}`
          : `/recipient?lastEvaluatedKey=${lastEvaluatedKey}`,
      );
    }
  }, [inView, lastEvaluatedKey, fetchMore, loadingMore, search]);

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
              <RecipientItem data={item} onDelete={onDelete} onEdit={onEdit} />
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
        title="Delete Recipient"
      />
    </>
  );
};

export default RecipientsTab;
