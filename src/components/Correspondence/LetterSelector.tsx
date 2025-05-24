import { Letter } from '@ts-types/letter';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useRef, useEffect } from 'react';

const getLetterDate = (letter: Letter) => {
  if (letter.sentAt) {
    return new Date(letter.sentAt).toLocaleDateString();
  } else if (letter.receivedAt) {
    return new Date(letter.receivedAt).toLocaleDateString();
  } else {
    return 'No Date';
  }
};

interface Props {
  letters: Letter[];
  onSelect: (index: number) => void;
  selected: number;
}

const LetterSelector: React.FC<Props> = ({ letters, onSelect, selected }) => {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const selectedEl = itemRefs.current[selected];
    selectedEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [selected]);

  return (
    <div className="flex flex-col items-start space-y-2 max-h-[350px]">
      <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
        Letters
      </h1>
      <button
        aria-label="Scroll up one letter"
        className="text-white hover:scale-110 transition"
        onClick={() => onSelect(Math.max(0, selected - 1))}
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
                ${
                  isSelected
                    ? 'bg-white/20 text-white font-semibold rounded px-2 py-1 shadow border-l-4 border-white pl-2'
                    : 'hover:bg-white/10 hover:text-white/90 transition px-2 py-1 rounded'
                }
                hover:opacity-100 hover:underline
              `}
            >
              {getLetterDate(letter)}
            </button>
          );
        })}
      </div>
      <button
        aria-label="Scroll down one letter"
        className="text-white hover:scale-110 transition"
        onClick={() => onSelect(Math.min(letters.length - 1, selected + 1))}
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default LetterSelector;
