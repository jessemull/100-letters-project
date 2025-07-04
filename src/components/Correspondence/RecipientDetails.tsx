import React from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { categoryLabelMap } from '@constants/correspondence';

interface Props {
  correspondence: CorrespondenceCard;
}

const RecipientDetails: React.FC<Props> = ({ correspondence }) => (
  <div className="space-y-4 md:bg-white/20 md:p-4 lg:p-5 md:rounded-2xl md:shadow-xl md:border md:border-white/10 md:backdrop-blur-md md:h-full md:flex md:flex-col md:overflow-y-auto">
    {/* Recipient Details */}
    <div className="md:flex-shrink-0">
      <div className="hidden md:flex md:justify-between md:items-start mb-2">
        <h2 className="text-2xl font-bold text-white">
          {correspondence?.recipient?.firstName}{' '}
          {correspondence?.recipient?.lastName}
        </h2>
        <span className="border border-white rounded-md bg-white/10 px-3 py-1 text-base font-bold uppercase tracking-wider text-white shadow-sm">
          {categoryLabelMap[correspondence?.reason?.category] || 'Other'}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2 md:hidden">
        {correspondence?.recipient?.firstName}{' '}
        {correspondence?.recipient?.lastName}
      </h2>
      <div className="space-y-1">
        <p className="text-white/70 italic text-sm leading-tight">
          {correspondence?.recipient?.occupation}
        </p>
        <p className="text-white/60 text-sm leading-tight">
          {correspondence?.recipient?.organization}
        </p>
      </div>
    </div>
    <div className="md:flex-1 md:min-h-0">
      <p className="italic text-white/90 mt-4 md:mt-0 whitespace-pre-line">
        {correspondence?.recipient?.description}
      </p>
    </div>
  </div>
);

export default RecipientDetails;
