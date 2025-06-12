import React from 'react';
import { Letter } from '@ts-types/letter';
import { correspondenceStatusLabelMap } from '@constants/correspondence';

interface Props {
  letter: Letter;
}

const LetterDetails: React.FC<Props> = ({ letter }) => (
  <div className="space-y-2 md:bg-white/20 md:p-4 lg:p-5 md:rounded-2xl md:shadow-xl md:border md:border-white/10 md:backdrop-blur-md">
    <h2 className="text-2xl md:text-xl font-bold text-white mb-2">
      Letter Details
    </h2>
    <div className="space-y-1">
      {letter?.status && (
        <p className="text-white/85 text-md font-medium leading-tight">
          {correspondenceStatusLabelMap[letter.status]}
        </p>
      )}
      {letter?.sentAt && (
        <p className="text-white/85 italic text-md leading-tight">
          Sent: {new Date(letter.sentAt).toLocaleDateString()}
        </p>
      )}
      {letter?.receivedAt && !letter?.sentAt && (
        <p className="text-white/85 italic text-md leading-tight">
          Received: {new Date(letter.receivedAt).toLocaleDateString()}
        </p>
      )}
    </div>
    {letter?.description && (
      <p className="italic text-white/90 mt-4 leading-relaxed break-words overflow-hidden">
        {letter.description}
      </p>
    )}
  </div>
);

export default LetterDetails;
