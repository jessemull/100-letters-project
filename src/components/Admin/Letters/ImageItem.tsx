'use client';

import Image from 'next/image';
import React from 'react';
import { LetterImage, View } from '@ts-types/letter';
import { PenSquare, Trash2 } from 'lucide-react';

interface Props {
  data: LetterImage;
}

const viewToLabel = {
  [View.LETTER_FRONT]: 'Letter Front',
  [View.LETTER_BACK]: 'Letter Back',
  [View.ENVELOPE_FRONT]: 'Envelope Front',
  [View.ENVELOPE_BACK]: 'Envelope Back',
  [View.OTHER]: 'Other',
};

const ImageItem = ({ data }: Props) => {
  return (
    <div
      data-testid="card-edit-button"
      className="p-4 bg-white/10 border border-white rounded-xl transition-transform transform hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-center">
        <div className="w-20 h-20 relative rounded-md overflow-hidden mr-4 flex-shrink-0 border border-white/20">
          <Image
            alt={data.caption || 'Letter Image'}
            className="object-cover"
            fill
            sizes="80px"
            src={data?.url}
          />
        </div>
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-white">
              {viewToLabel[data?.view]}
            </h3>
            <p className="text-sm text-gray-300">
              {data?.caption ? `${data.caption.slice(0, 25)}...` : 'No Caption'}
            </p>
          </div>
          <div className="space-x-2 flex items-center justify-center">
            <button
              data-testid="edit-button"
              className="text-white hover:text-gray-400"
              aria-label="Edit"
            >
              <PenSquare className="w-6 h-6" />
            </button>
            <button
              data-testid="delete-button"
              className="text-white hover:text-gray-400"
              aria-label="Delete"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageItem;
