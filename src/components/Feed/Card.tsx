'use client';

import React from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { Image } from '@components/Image';
import { useRouter } from 'next/navigation';

interface Props {
  correspondence: CorrespondenceCard;
  loading?: string;
  priority?: boolean;
}

const Card: React.FC<Props> = ({ correspondence, loading, priority }) => {
  const router = useRouter();
  const { correspondenceId, letters, reason, recipient, title } =
    correspondence;

  const firstImage = letters[0]?.imageURLs[0];
  const imageCaption = firstImage?.caption;

  const handleClick = () => {
    router.push(`/correspondence?correspondenceId=${correspondenceId}`);
  };

  return (
    <div
      key={correspondenceId}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      className="rounded-xl overflow-hidden shadow-lg text-black font-merriweather cursor-pointer transform transition duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white group"
    >
      <div className="relative overflow-hidden">
        <Image
          src={firstImage?.url || '/alt-image.jpg'}
          alt={imageCaption || letters[0]?.title || 'Letter Image'}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          loading={loading}
          priority={priority}
        />
        {/* Caption overlay - appears on hover */}
        {imageCaption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3 transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <p className="text-sm font-medium">{imageCaption}</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-white/20 h-full rounded-b-xl border-t border-white/10 backdrop-blur-md">
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
