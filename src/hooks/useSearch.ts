'use client';

import Fuse from 'fuse.js';
import {
  CorrespondenceSearchItem,
  LetterSearchItem,
  RecipientSearchItem,
  SearchAllItem,
  SearchOptions,
  SearchResult,
  SearchType,
} from '@ts-types/search';
import { useState, useEffect, useMemo } from 'react';

type FuseMap = Record<SearchType, Fuse<any>>;

export function useSearch({
  type,
  term,
  limit = 100,
}: SearchOptions): SearchResult[] {
  const [fuseMap, setFuseMap] = useState<FuseMap | null>(null);

  useEffect(() => {
    async function loadSearchData() {
      const dataModule = await import('@public/data.json');
      const searchIndexModule = await import('@public/search.json');

      const { correspondences: correspondenceData } = dataModule;

      const all = new Fuse<SearchAllItem>(
        correspondenceData as SearchAllItem[],
        {
          threshold: 0.3,
          isCaseSensitive: false,
          keys: [
            { name: 'letters.title', weight: 0.2 },
            { name: 'reason.domain', weight: 0.15 },
            { name: 'recipient.firstName', weight: 0.1 },
            { name: 'recipient.fullName', weight: 0.15 },
            { name: 'recipient.lastName', weight: 0.1 },
            { name: 'title', weight: 0.3 },
          ],
        },
      );

      const correspondences = new Fuse<CorrespondenceSearchItem>(
        searchIndexModule.correspondences,
        {
          keys: ['title'],
          threshold: 0.3,
        },
      );

      const recipients = new Fuse<RecipientSearchItem>(
        searchIndexModule.recipients,
        {
          keys: ['firstName', 'lastName', 'fullName'],
          threshold: 0.3,
        },
      );

      const letters = new Fuse<LetterSearchItem>(searchIndexModule.letters, {
        keys: ['title'],
        threshold: 0.3,
      });

      setFuseMap({ all, correspondences, recipients, letters });
    }

    loadSearchData();
  }, []);

  const results = useMemo(() => {
    if (!term.trim()) return [];
    if (!fuseMap) return [];
    const fuse = fuseMap[type];
    return fuse
      ? fuse
          .search(term)
          .slice(0, limit)
          .map((r) => r.item)
      : [];
  }, [type, term, limit, fuseMap]);

  return results;
}
