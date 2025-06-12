import React from 'react';
import { Letter } from '@ts-types/letter';

interface Props {
  letter: Letter;
}

const LetterText: React.FC<Props> = ({ letter }) => (
  <div>
    <div className="space-y-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg break-words overflow-hidden mb-3">
        {letter?.title}
      </h1>
      <div className="text-white/90 whitespace-pre-line break-words overflow-hidden">
        {letter?.text}
      </div>
    </div>
  </div>
);

export default LetterText;
