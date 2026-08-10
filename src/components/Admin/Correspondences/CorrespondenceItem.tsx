'use client';

import Link from 'next/link';
import React from 'react';
import { Correspondence } from '@ts-types/correspondence';
import { PenSquare, Trash2 } from 'lucide-react';

interface Props {
  data: Correspondence;
  editHref: string;
  onDelete: (id: string) => void;
}

const CorrespondenceItem = ({ data, editHref, onDelete }: Props) => {
  return (
    <div
      data-testid="card-edit-button"
      className="p-4 backdrop-blur-md bg-white/10 border border-white rounded-xl transition-transform transition-shadow transform hover:scale-[1.01]"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{data.title}</h3>
          <p className="text-sm text-gray-300">
            {`${data.recipient?.firstName} ${data.recipient?.lastName}`}
          </p>
        </div>
        <div className="space-x-2 flex align-center justify-center">
          <Link
            href={editHref}
            data-testid="edit-button"
            className="text-white hover:text-gray-400 cursor-pointer"
            aria-label={`Edit correspondence ${data.title}`}
          >
            <PenSquare className="w-6 h-6" />
          </Link>
          <button
            data-testid="delete-button"
            onClick={() => onDelete(data.correspondenceId)}
            className="text-white hover:text-gray-400 cursor-pointer"
            aria-label={`Delete correspondence ${data.title}`}
            type="button"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorrespondenceItem;
