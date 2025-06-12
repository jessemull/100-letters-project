import React from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';

interface Props {
  correspondence: CorrespondenceCard;
}

const RecipientDetails: React.FC<Props> = ({ correspondence }) => (
  <div className="space-y-2 md:bg-white/20 md:p-4 lg:p-5 md:rounded-2xl md:shadow-xl md:border md:border-white/10 md:backdrop-blur-md">
    <h2 className="text-2xl md:text-xl font-bold text-white mb-2">Recipient</h2>
    <div className="space-y-1">
      <p className="text-white/90 text-lg md:text-md leading-tight">
        {correspondence?.recipient?.firstName}{' '}
        {correspondence?.recipient?.lastName}
      </p>
      <p className="text-white/70 italic text-sm leading-tight">
        {correspondence?.recipient?.occupation}
      </p>
      <p className="text-white/60 text-sm leading-tight">
        {correspondence?.recipient?.organization}
      </p>
    </div>
    <p className="italic text-white/90 mt-4">
      {correspondence?.recipient?.description}
    </p>
  </div>
);

export default RecipientDetails;
