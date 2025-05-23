import React from 'react';
import { Letter } from '@ts-types/letter';

interface Props {
  letter: Letter;
}

const LetterDetails: React.FC<Props> = ({ letter }) => (
  <div className="bg-white/10 p-4 rounded-xl">
    <h2 className="text-xl font-semibold">Details</h2>
    <p>{letter.title}</p>
    {letter.sentAt && (
      <p className="text-white/70 italic">
        {`Sent: ${new Date(letter.sentAt).toLocaleDateString()}`}
      </p>
    )}
    {letter.receivedAt && (
      <p className="text-white/70 italic">
        {`Received: ${new Date(letter.receivedAt).toLocaleDateString()}`}
      </p>
    )}
    {letter.status && (
      <p className="text-white/70 italic">{`Status: ${letter.status}`}</p>
    )}
    <p className="mt-2 text-white/80">{letter.description}</p>
  </div>
);

export default LetterDetails;
