import React, { ChangeEvent } from 'react';
import { Letter } from '@ts-types/letter';
import { Select } from '@components/Form';
import { getLetterDate } from '@util/letter';

interface Props {
  letters: Letter[];
  selected: number;
  onSelect: (index: number) => void;
}

const LetterSelectorMobile: React.FC<Props> = ({
  letters,
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
      <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg mb-4">
        Letters
      </h1>
      <Select
        className="text-lg"
        id="letter-selector-mobile"
        label="Select a letter"
        options={options}
        value={selected.toString()}
        onChange={handleChange}
        placeholder="Select a letter date"
      />
    </div>
  );
};

export default LetterSelectorMobile;
