'use client';

import React from 'react';
import { Correspondence } from '@ts-types/correspondence';
import { PenSquare, Trash2 } from 'lucide-react';

interface Props {
  data: Correspondence;
}

const CorrespondenceItem = ({ data }: Props) => {
  const onEdit = () => {
    console.log('onEdit', data);
  };

  const onDelete = () => {
    console.log('onDelete', data);
  };

  return (
    <div
      data-testid="card-edit-button"
      className="p-4 bg-white/10 border border-white rounded-xl transition-transform transition-shadow transform hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{data.title}</h3>
          <p className="text-sm text-gray-300">
            {`${data.recipient?.firstName} ${data.recipient?.lastName}`}
          </p>
        </div>
        <div className="space-x-2 flex align-center justify-center">
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

export default CorrespondenceItem;
