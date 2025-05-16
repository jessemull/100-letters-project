import Fuse from 'fuse.js';
import searchIndex from '@public/search.json';
import {
  CorrespondenceSearchItem,
  LetterSearchItem,
  RecipientSearchItem,
  SearchOptions,
  SearchResult,
  SearchType,
} from '@ts-types/search';
import { useMemo } from 'react';

const correspondences = new Fuse<CorrespondenceSearchItem>(
  searchIndex.correspondences,
  {
    keys: ['title'],
    threshold: 0.3,
  },
);

const recipients = new Fuse<RecipientSearchItem>(searchIndex.recipients, {
  keys: ['firstName', 'lastName', 'fullName'],
  threshold: 0.3,
});

const letters = new Fuse<LetterSearchItem>(searchIndex.letters, {
  keys: ['title'],
  threshold: 0.3,
});

const fuseMap: Record<SearchType, Fuse<any>> = {
  correspondences,
  recipients,
  letters,
};

export function useSearch({
  type,
  term,
  limit = 100,
}: SearchOptions): SearchResult[] {
  const results = useMemo(() => {
    console.log(term, type);
    if (!term.trim()) return [];
    const fuse = fuseMap[type];
    return fuse
      .search(term)
      .slice(0, limit)
      .map((r) => r.item);
  }, [type, term, limit]);
  return results;
}
