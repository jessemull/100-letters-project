import React, { ChangeEvent } from 'react';
import { Letter } from '@ts-types/letter';
import { Select } from '@components/Form';

interface Props {
  letters: Letter[];
  selected: number;
  onSelect: (index: number) => void;
}

const getLetterDate = (letter: Letter) => {
  if (letter.sentAt) return new Date(letter.sentAt).toLocaleDateString();
  if (letter.receivedAt)
    return new Date(letter.receivedAt).toLocaleDateString();
  return 'No Date';
};

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
    <div className="pt-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg mb-4">
        Letters
      </h1>
      <Select
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
