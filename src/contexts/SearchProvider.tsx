'use client';

import searchIndex from '@public/data/search.json';
import { SearchContextType } from '@ts-types/context';
import { createContext, useContext, ReactNode } from 'react';

export const SearchContext = createContext<SearchContextType>({
  correspondences: [],
  recipients: [],
  letters: [],
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SearchContext.Provider
      value={{
        correspondences: searchIndex.correspondences,
        recipients: searchIndex.recipients,
        letters: searchIndex.letters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchData = () => useContext(SearchContext);
