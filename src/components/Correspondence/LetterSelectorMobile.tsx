import React, { ChangeEvent } from 'react';
import { Letter } from '@ts-types/letter';
import { Select } from '@components/Form';
import { getLetterDate } from '@util/letter';

interface Props {
  letters: Letter[];
  selected: number;
  onSelect: (index: number) => void;
  onScrollToText?: () => void;
}

const LetterSelectorMobile: React.FC<Props> = ({
  letters = [],
  selected,
  onSelect,
  onScrollToText,
}) => {
  const options = letters.map((letter, idx) => ({
    label: getLetterDate(letter),
    value: idx.toString(),
  }));

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    onSelect(idx);
  };

  return (
    <div className="pb-1 md:mt-0 mb-2 md:mb-4">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-lg mb-4">
          Letters{' '}
          <span className="hidden lg:inline tabular-nums">
            ({letters.length})
          </span>
        </h1>
        {onScrollToText && (
          <button
            onClick={onScrollToText}
            className="border border-white rounded-md bg-white/10 hover:bg-white/20 px-2 py-0.5 md:px-3 md:py-1 text-sm md:text-base font-bold uppercase tracking-wider text-white shadow-sm cursor-pointer transition-colors"
          >
            Read Text
          </button>
        )}
      </div>
      <Select
        className="text-md"
        id="letter-selector-mobile"
        label="Select a letter"
        options={options}
        value={selected.toString()}
        onChange={handleChange}
        placeholder="Select a letter date"
        size="small"
      />
    </div>
  );
};

export default LetterSelectorMobile;
