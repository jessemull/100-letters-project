'use client';

import React from 'react';
import { Correspondence } from '@ts-types/correspondence';
import { Image } from '@components/Admin/Letters';

interface Props {
  correspondence: Correspondence;
  loading?: string;
  priority?: boolean;
}

const Card: React.FC<Props> = ({ correspondence, loading, priority }) => {
  const { correspondenceId, letters, reason, recipient, title } =
    correspondence;
  return (
    <div
      key={correspondenceId}
      className="rounded-xl overflow-hidden shadow-lg text-black font-merriweather cursor-pointer transform transition duration-200 hover:scale-[1.02]"
    >
      <Image
        src={letters[0]?.imageURLs[0]?.urlThumbnail || '/missing.jpg'}
        alt={letters[0]?.title || 'Letter Image'}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
        loading={loading}
        priority={priority}
      />
      <div className="p-4 bg-white/10 h-full">
        <h3 className="text-lg text-white font-bold">{title}</h3>
        <p className="text-sm text-white">
          {recipient.lastName}, {recipient.firstName}
        </p>
        <p className="text-sm text-white italic">{reason.description}</p>
      </div>
    </div>
  );
};

export default Card;
