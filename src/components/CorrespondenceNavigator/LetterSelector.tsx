import { Letter } from '@ts-types/letter';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useRef, useEffect } from 'react';

const getLetterDate = (letter: Letter) => {
  if (letter.sentAt) return new Date(letter.sentAt).toLocaleDateString();
  if (letter.receivedAt)
    return new Date(letter.receivedAt).toLocaleDateString();
  return 'No Date';
};

const LetterSelector = ({
  letters,
  selected,
  onSelect,
}: {
  letters: Letter[];
  selected: number;
  onSelect: (index: number) => void;
}) => {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const selectedEl = itemRefs.current[selected];
    selectedEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [selected]);

  return (
    <div className="flex flex-col items-start space-y-2 max-h-[400px]">
      <h2 className="text-2xl font-semibold text-white mb-2">Letters</h2>

      <button
        onClick={() => onSelect(Math.max(0, selected - 1))}
        className="text-white hover:scale-110 transition"
      >
        <ChevronUp size={20} />
      </button>

      <div className="flex flex-col space-y-2 overflow-y-auto max-h-[300px] pr-1">
        {letters.map((letter, idx) => {
          const isSelected = idx === selected;
          return (
            <button
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              key={letter.letterId}
              onClick={() => onSelect(idx)}
              className={`text-left text-white transition transform duration-150 ease-in-out
                ${isSelected ? 'font-bold underline' : 'opacity-80'}
                hover:opacity-100 hover:underline
              `}
            >
              {getLetterDate(letter)}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onSelect(Math.min(letters.length - 1, selected + 1))}
        className="text-white hover:scale-110 transition"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default LetterSelector;
