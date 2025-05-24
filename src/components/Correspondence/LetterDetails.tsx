import React from 'react';
import { Letter } from '@ts-types/letter';

interface Props {
  letter: Letter;
}

const LetterDetails: React.FC<Props> = ({ letter }) => (
  <div className="bg-white/20 p-4 lg:p-5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md">
    <h2 className="text-xl font-bold text-white mb-2">Letter Details</h2>
    <p className="text-white/90 text-lg mb-1 break-words overflow-hidden">
      {letter.title}
    </p>

    {letter.sentAt && (
      <p className="text-white/70 italic mb-1">
        {`Sent: ${new Date(letter.sentAt).toLocaleDateString()}`}
      </p>
    )}
    {letter.receivedAt && (
      <p className="text-white/70 italic mb-1">
        {`Received: ${new Date(letter.receivedAt).toLocaleDateString()}`}
      </p>
    )}
    {letter.status && (
      <p className="text-white/70 font-medium mb-2">
        {`Status: ${letter.status}`}
      </p>
    )}
    <p className="mt-2 text-white/85 leading-relaxed break-words overflow-hidden">
      {letter.description}
    </p>
  </div>
);

export default LetterDetails;
