'use client';

import Link from 'next/link';
import React from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { Image } from '@components/Image';

interface Props {
  correspondence: CorrespondenceCard;
  loading?: string;
  priority?: boolean;
}

const Card: React.FC<Props> = ({ correspondence, loading, priority }) => {
  const { correspondenceId, letters, reason, recipient, title } =
    correspondence;

  const firstImage = letters[0]?.imageURLs[0];
  const imageCaption = firstImage?.caption;

  return (
    <Link
      href={`/correspondence?correspondenceId=${correspondenceId}`}
      className="block rounded-xl overflow-hidden shadow-lg text-black font-merriweather cursor-pointer transform transition duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
    >
      <Image
        src={firstImage?.url || '/alt-image.jpg'}
        alt={imageCaption || letters[0]?.title || 'Letter Image'}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
        loading={loading}
        priority={priority}
      />
      <div className="p-4 bg-white/20 h-full rounded-b-xl border-t border-white/10 backdrop-blur-md">
        <h3 className="text-lg text-white font-bold">{title}</h3>
        <p className="text-sm text-white">
          {recipient.lastName}, {recipient.firstName}
        </p>
        <p className="text-sm text-white italic">{reason.description}</p>
      </div>
    </Link>
  );
};

export default Card;
