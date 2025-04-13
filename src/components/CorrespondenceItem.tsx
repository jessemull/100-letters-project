'use client';

import React from 'react';
import { PenSquare, Trash2 } from 'lucide-react';
import { Correspondence } from '../types';

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
      role="button"
      tabIndex={0}
      className="p-4 border-2 border-black rounded-xl shadow transition-transform transition-shadow transform hover:scale-[1.01] hover:shadow-2xl cursor-pointer"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onEdit();
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-xl">{data.title || 'No Title'}</h3>
          <p className="text-md text-gray-600">
            {data?.recipient
              ? `${data.recipient?.firstName} ${data.recipient?.lastName}`
              : 'No Recipient'}
          </p>
        </div>
        <div className="space-x-2 flex align-center justify-center">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-black"
            aria-label="Edit"
          >
            <PenSquare className="w-8 h-8" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-black"
            aria-label="Edit"
          >
            <Trash2 className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorrespondenceItem;
