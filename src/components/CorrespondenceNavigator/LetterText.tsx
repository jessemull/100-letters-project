import React from 'react';
import { Letter } from '@ts-types/letter';

interface Props {
  letter: Letter;
}

const LetterText: React.FC<Props> = ({ letter }) => (
  <div>
    <div className="space-y-4 pt-12">
      <h1 className="text-3xl font-bold">{letter.title}</h1>
      <p className="italic text-white/80">{letter.text}</p>
    </div>
  </div>
);

export default LetterText;
