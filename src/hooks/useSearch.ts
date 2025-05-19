import Fuse from 'fuse.js';
import data from '@data/data.json';
import searchIndex from '@data/search.json';
import {
  CorrespondenceSearchItem,
  LetterSearchItem,
  RecipientSearchItem,
  SearchAllItem,
  SearchOptions,
  SearchResult,
  SearchType,
} from '@ts-types/search';
import { useMemo } from 'react';

const { correspondences: correspondenceData } = data;

const all = new Fuse<SearchAllItem>(correspondenceData as SearchAllItem[], {
  threshold: 0.3,
  keys: [
    { name: 'letters.title', weight: 0.2 },
    { name: 'reason.domain', weight: 0.15 },
    { name: 'recipient.firstName', weight: 0.1 },
    { name: 'recipient.fullName', weight: 0.15 },
    { name: 'recipient.lastName', weight: 0.1 },
    { name: 'title', weight: 0.3 },
  ],
});

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
  all,
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
    if (!term.trim()) return [];
    const fuse = fuseMap[type];
    return fuse
      .search(term)
      .slice(0, limit)
      .map((r) => r.item);
  }, [type, term, limit]);
  return results;
}
