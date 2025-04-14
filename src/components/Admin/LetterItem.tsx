'use client';

import React from 'react';
import { Letter } from '@ts-types/letter';
import { PenSquare, Trash2 } from 'lucide-react';

interface Props {
  data: Letter;
}

const LetterItem = ({ data }: Props) => {
  const onEdit = () => {
    console.log('onEdit', data);
  };

  const onDelete = () => {
    console.log('onDelete', data);
  };

  return (
    <div
      data-testid="card-edit-button"
      className="p-4 border border-black rounded-xl shadow transition-transform transition-shadow transform hover:scale-[1.01] hover:shadow-2xl cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{data.title}</h3>
          <p className="text-sm text-gray-600">{data.text?.slice(0, 25)}...</p>
        </div>
        <div className="space-x-2 flex align-center justify-center">
          <button
            data-testid="edit-button"
            onClick={onEdit}
            className="text-gray-500 hover:text-black"
            aria-label="Edit"
          >
            <PenSquare className="w-6 h-6" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-black"
            aria-label="Edit"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterItem;
