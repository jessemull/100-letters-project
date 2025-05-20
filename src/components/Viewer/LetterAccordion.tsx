import React from 'react';
import { Correspondence } from '@ts-types/correspondence';
import { Letter } from '@ts-types/letter';

interface Props {
  correspondence: Correspondence;
  selected: number;
  onClick?: (idx: number, letter: Letter) => void;
}

const LetterAccordion: React.FC<Props> = ({
  correspondence,
  selected,
  onClick,
}) =>
  correspondence.letters.map((letter, idx) => (
    <button
      key={letter.letterId}
      onClick={() => onClick?.(idx, letter)}
      className={`border border-white w-full rounded-xl bg-white/20 text-left font-medium px-4 py-3 ${selected === idx ? 'bg-white/30' : 'hover:bg-white/30'} flex items-center justify-between transition-colors`}
    >
      {letter.title}
    </button>
  ));

export default LetterAccordion;
