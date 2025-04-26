'use client';

import React, { useState } from 'react';
import { ConfirmationModal, Progress, showToast } from '@components/Form';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { CorrespondenceItem } from '@components/Admin';
import {
  GetCorrespondencesResponse,
  DeleteCorrespondenceResponse,
  CorrespondenceParams,
} from '@ts-types/correspondence';

const CorrespondencesTab: React.FC = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [correspondenceId, setCorrespondenceId] = useState('');

  const router = useRouter();
  const { token } = useAuth();

  const { data, isLoading } = useSWRQuery<GetCorrespondencesResponse>({
    path: '/correspondence',
    token,
  });

  const { isLoading: isDeleting, mutate } = useSWRMutation<
    {},
    DeleteCorrespondenceResponse,
    GetCorrespondencesResponse,
    CorrespondenceParams
  >({
    method: 'DELETE',
    key: '/correspondence',
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
    onUpdate: ({ prev, params }) => {
      const lastEvaluatedKey = prev ? prev.lastEvaluatedKey : '';
      const data = prev
        ? prev.data.filter(
            (c) => c.correspondenceId !== params?.correspondenceId,
          )
        : [];
      return {
        data,
        lastEvaluatedKey,
      };
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
              <CorrespondenceItem
                data={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
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
        title="Delete Correspondence"
      />
    </>
  );
};

export default CorrespondencesTab;
