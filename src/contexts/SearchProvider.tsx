'use client';

import searchIndex from '@public/data/search.json';
import {
  CorrespondenceSearchItem,
  LetterSearchItem,
  RecipientSearchItem,
} from '@ts-types/search';
import { createContext, useContext, ReactNode } from 'react';

export interface SearchContextType {
  correspondences: CorrespondenceSearchItem[];
  recipients: RecipientSearchItem[];
  letters: LetterSearchItem[];
}

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
