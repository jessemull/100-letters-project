'use client';

import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, ReactNode } from 'react';

interface SearchSectionProps<T> {
  data: T[];
  onItemClick: (item: T) => void;
  renderItem: (item: T) => ReactNode;
  results: T[];
  setTerm: (term: string) => void;
  term: string;
  title: string;
}

const accordionTransition = {
  duration: 0.3,
  ease: 'easeInOut' as const,
};

function SearchSection<T>({
  data,
  onItemClick,
  renderItem,
  results,
  setTerm,
  term,
  title,
}: SearchSectionProps<T>) {
  const [isOpen, setIsOpen] = useState(true);
  const [itemsToShowCount, setItemsToShowCount] = useState(10);

  const itemsToRender = term ? results : data.slice(0, itemsToShowCount);

  const showMoreButtonVisible = !term && itemsToShowCount < data.length;

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full font-semibold text-left text-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="search-section-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={accordionTransition}
            className="overflow-hidden"
          >
            <div className="mt-3">
              <div className="relative">
                <input
                  type="text"
                  aria-label={`Search ${title}`}
                  placeholder={`Search ${title.toLowerCase()}...`}
                  className="text-xs pl-6 pr-6 w-full h-7 rounded-lg bg-white/25 border border-white text-white placeholder-white/70 focus:outline-none"
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setItemsToShowCount(10);
                  }}
                />
                <Search
                  size={13}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                />
                {term && (
                  <button
                    type="button"
                    aria-label={`Clear ${title} search`}
                    onClick={() => setTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <ul className="space-y-2 text-white text-sm mt-3">
                {itemsToRender.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => onItemClick(item)}
                      className="w-full text-left bg-transparent hover:bg-white/10 rounded transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      {renderItem(item)}
                    </button>
                  </li>
                ))}
              </ul>
              {showMoreButtonVisible && (
                <button
                  type="button"
                  onClick={() => setItemsToShowCount((count) => count + 10)}
                  className="mt-2 mb-4 text-sm text-white/80 hover:text-white underline-offset-2 hover:underline cursor-pointer transition"
                >
                  Show more...
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchSection;
