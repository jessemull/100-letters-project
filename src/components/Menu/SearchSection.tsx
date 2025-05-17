'use client';

import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useState, ReactNode } from 'react';

interface SearchSectionProps<T> {
  title: string;
  data: T[];
  results: T[];
  renderItem: (item: T) => ReactNode;
  setTerm: (term: string) => void;
  term: string;
}

function SearchSection<T>({
  title,
  data,
  results,
  renderItem,
  setTerm,
  term,
}: SearchSectionProps<T>) {
  const [isOpen, setIsOpen] = useState(true);
  const [itemsToShowCount, setItemsToShowCount] = useState(10);

  const itemsToRender = term ? results : data.slice(0, itemsToShowCount);

  const showMoreButtonVisible = !term && itemsToShowCount < data.length;

  return (
    <div>
      <button
        className="flex items-center justify-between w-full font-semibold text-left text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div className="mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              className="text-sm pl-7 pr-3 w-full h-8 rounded-xl bg-white/25 border border-white text-white placeholder-white/70 focus:outline-none"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setItemsToShowCount(10);
              }}
            />
            <Search
              size={15}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white pointer-events-none"
            />
          </div>
          <ul className="space-y-2 text-white text-sm mt-3">
            {itemsToRender.map((item, i) => (
              <li key={i}>{renderItem(item)}</li>
            ))}
          </ul>
          {showMoreButtonVisible && (
            <button
              onClick={() => setItemsToShowCount((count) => count + 10)}
              className={`mt-2 mb-4
              text-white 
              text-sm 
              px-3 py-1 rounded 
              bg-white/10 hover:bg-white/20 
              border border-white/30 
              transition
            `}
            >
              Show More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchSection;
