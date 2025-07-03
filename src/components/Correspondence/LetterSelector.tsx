import { Letter } from '@ts-types/letter';
import { StepBack, StepForward } from 'lucide-react';
import { getLetterDate } from '@util/letter';
import { useRef, useEffect } from 'react';
import { Category } from '@ts-types/correspondence';

interface Props {
  category: Category;
  letters: Letter[];
  onSelect: (index: number) => void;
  selected: number;
}

const LetterSelectorHorizontal: React.FC<Props> = ({
  category,
  letters = [],
  onSelect,
  selected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const selectedEl = itemRefs.current[selected];

    if (container && selectedEl) {
      const offset =
        selectedEl.offsetLeft -
        container.offsetLeft -
        container.clientWidth / 2 +
        selectedEl.clientWidth / 2;
      container.scrollTo({
        left: offset,
        behavior: 'smooth',
      });
    }
  }, [selected]);

  return (
    <div className="flex flex-col max-w-full mb-4">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg mb-4">
          Letters <span className="tabular-nums">({letters.length})</span>
        </h1>
      </div>
      <div className="flex items-center space-x-1 overflow-hidden">
        <button
          aria-label="Scroll left one letter"
          className="
            text-white
            shadow-md
            transition 
            transform 
            hover:scale-110
          "
          onClick={() => onSelect(Math.max(0, selected - 1))}
        >
          <StepBack size={20} className="text-white fill-white" />
        </button>
        <div
          ref={containerRef}
          className="flex overflow-x-auto space-x-2 max-w-full min-w-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-hide-unless-hover"
        >
          {letters.map((letter, idx) => {
            const isSelected = idx === selected;
            return (
              <button
                key={letter.letterId}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                onClick={() => onSelect(idx)}
                className={`text-md whitespace-nowrap px-3 py-1 rounded transition truncate max-w-[120px]
                  ${
                    isSelected
                      ? 'bg-white/20 text-md text-white font-semibold shadow border-b-4 border-white'
                      : 'hover:bg-white/10 text-md hover:text-white/90 text-white/80'
                  }`}
              >
                {getLetterDate(letter)}
              </button>
            );
          })}
        </div>
        <button
          aria-label="Scroll right one letter"
          className="
            text-white
            shadow-md
            transition 
            transform 
            hover:scale-110
          "
          onClick={() => onSelect(Math.min(letters.length - 1, selected + 1))}
        >
          <StepForward size={20} className="text-white fill-white" />
        </button>
      </div>
    </div>
  );
};

export default LetterSelectorHorizontal;
