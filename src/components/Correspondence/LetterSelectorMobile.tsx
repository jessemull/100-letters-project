import React, { ChangeEvent } from 'react';
import { Category } from '@ts-types/correspondence';
import { Letter } from '@ts-types/letter';
import { Select } from '@components/Form';
import { categoryLabelMap } from '@constants/correspondence';
import { getLetterDate } from '@util/letter';

interface Props {
  category: Category;
  letters: Letter[];
  selected: number;
  onSelect: (index: number) => void;
}

const LetterSelectorMobile: React.FC<Props> = ({
  category,
  letters = [],
  selected,
  onSelect,
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
    <div className="pt-2 pb-1 mt-4 md:mt-0 mb-4">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-lg mb-4">
          Letters{' '}
          <span className="hidden md:inline tabular-nums">
            ({letters.length})
          </span>
        </h1>
        <span className="border border-white rounded-md bg-white/10 px-2 text-sm sm:text-md font-bold uppercase tracking-wider text-white shadow-sm">
          {categoryLabelMap[category] || 'Other'}
        </span>
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
