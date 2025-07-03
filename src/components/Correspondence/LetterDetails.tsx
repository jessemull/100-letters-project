import React from 'react';
import { Letter } from '@ts-types/letter';
import { correspondenceStatusLabelMap } from '@constants/correspondence';

interface Props {
  letter: Letter;
}

const LetterDetails: React.FC<Props> = ({ letter }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      {letter?.status && (
        <p className="text-white text-md font-semibold leading-tight">
          {correspondenceStatusLabelMap[letter.status]}
        </p>
      )}
      {letter?.sentAt && (
        <p className="text-white/95 text-md font-medium leading-tight">
          Sent: {new Date(letter.sentAt).toLocaleDateString()}
        </p>
      )}
      {letter?.receivedAt && !letter?.sentAt && (
        <p className="text-white/95 text-md font-medium leading-tight">
          Received: {new Date(letter.receivedAt).toLocaleDateString()}
        </p>
      )}
    </div>
    {letter?.description && (
      <p className="text-white/95 font-medium italic leading-relaxed break-words overflow-hidden">
        {letter.description}
      </p>
    )}
  </div>
);

export default LetterDetails;
