'use client';

import React, { useState } from 'react';
import {
  DeleteRecipientResponse,
  GetRecipientsResponse,
} from '@ts-types/recipients';
import { ConfirmationModal, showToast } from '@components/Form';
import { Progress } from '@components/Form';
import { RecipientItem } from '@components/Admin';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';

export type RecipientParams = {
  recipientId: string;
};

const RecipientsTab: React.FC = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState('');

  const router = useRouter();

  const { token } = useAuth();

  const { data, isLoading } = useSWRQuery<GetRecipientsResponse>({
    path: '/recipient',
    token,
  });

  const { isLoading: isDeleting, mutate } = useSWRMutation<
    {},
    DeleteRecipientResponse,
    GetRecipientsResponse,
    RecipientParams
  >({
    method: 'DELETE',
    key: '/recipient',
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
    onUpdate: ({ prev, params }) => {
      const lastEvaluatedKey = prev ? prev.lastEvaluatedKey : '';
      const data = prev
        ? prev.data.filter(
            (recipient) => recipient.recipientId !== params?.recipientId,
          )
        : [];
      return {
        data,
        lastEvaluatedKey,
      };
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

  return (
    <>
      {isLoading || isDeleting ? (
        <div className="w-full flex-grow flex items-center justify-center py-24 min-h-[calc(100vh-475px)]">
          <Progress color="white" size={16} />
        </div>
      ) : (
        <ul className="grid gap-4">
          {data?.data.map((item, idx) => (
            <li key={idx}>
              <RecipientItem data={item} onDelete={onDelete} onEdit={onEdit} />
            </li>
          ))}
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
