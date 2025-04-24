'use client';

import React from 'react';
import { Letter } from '@ts-types/letter';
import { PenSquare, Trash2 } from 'lucide-react';

interface Props {
  data: Letter;
  onEdit: (letterId: string) => void;
  onDelete: (letterId: string) => void;
}

const LetterItem = ({ data, onEdit, onDelete }: Props) => {
  return (
    <div
      data-testid="card-edit-button"
      className="p-4 bg-white/10 border border-white rounded-xl transition-transform transform hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-white">{data.title}</h3>
          <p className="text-sm text-gray-300">{data.text?.slice(0, 25)}...</p>
        </div>
        <div className="space-x-2 flex items-center justify-center">
          <button
            data-testid="edit-button"
            onClick={() => onEdit(data.letterId)}
            className="text-white hover:text-gray-400"
            aria-label="Edit"
          >
            <PenSquare className="w-6 h-6" />
          </button>
          <button
            data-testid="delete-button"
            onClick={() => onDelete(data.letterId)}
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

export default LetterItem;
