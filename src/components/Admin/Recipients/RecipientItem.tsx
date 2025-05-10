'use client';

import React from 'react';
import { Recipient } from '@ts-types/recipients';
import { PenSquare, Trash2 } from 'lucide-react';

interface Props {
  data: Recipient;
  onEdit: (recipientId: string) => void;
  onDelete: (recipientId: string) => void;
}

const RecipientItem = ({ data, onDelete, onEdit }: Props) => {
  return (
    <div
      data-testid="card-edit-button"
      className="p-4 bg-white/10 border border-white rounded-xl transition-transform transform hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-white">
            {`${data?.lastName}, ${data?.firstName}`}
          </h3>
          <p className="text-sm text-gray-300">{data?.organization}</p>
        </div>
        <div className="space-x-2 flex items-center justify-center">
          <button
            data-testid="edit-button"
            onClick={() => onEdit(data?.recipientId)}
            className="text-white hover:text-gray-400"
            aria-label="Edit"
          >
            <PenSquare className="w-6 h-6" />
          </button>
          <button
            data-testid="delete-button"
            onClick={() => onDelete(data?.recipientId)}
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
