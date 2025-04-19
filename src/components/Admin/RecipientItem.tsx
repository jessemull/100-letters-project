'use client';

import React from 'react';
import { Recipient } from '@ts-types/recipients';
import { PenSquare, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  data: Recipient;
}

const RecipientItem = ({ data }: Props) => {
  const router = useRouter();

  const onEdit = () => {
    router.push(`/admin/recipient?recipientId=${data.recipientId}`);
  };

  const onDelete = () => {
    console.log('onDelete', data);
  };

  return (
    <div
      data-testid="card-edit-button"
      className="p-4 bg-white/10 border border-white rounded-xl transition-transform transform hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-white">
            {`${data?.firstName} ${data?.lastName}`}
          </h3>
          <p className="text-sm text-gray-300">{data?.organization}</p>
        </div>
        <div className="space-x-2 flex items-center justify-center">
          <button
            data-testid="edit-button"
            onClick={onEdit}
            className="text-white hover:text-gray-400"
            aria-label="Edit"
          >
            <PenSquare className="w-6 h-6" />
          </button>
          <button
            onClick={onDelete}
            className="text-white hover:text-gray-400"
            aria-label="Delete"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipientItem;
