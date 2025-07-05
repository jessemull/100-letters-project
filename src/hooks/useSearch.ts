'use client';

import Fuse from 'fuse.js';
import {
  CorrespondenceSearchItem,
  LetterSearchItem,
  RecipientSearchItem,
  SearchOptions,
  SearchResult,
} from '@ts-types/search';
import { FuseMap } from '@ts-types/hooks';
import { useState, useEffect, useMemo } from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';

export const useSearch = ({
  type,
  term,
  limit = 100,
}: SearchOptions): SearchResult[] => {
  const [fuseMap, setFuseMap] = useState<FuseMap | null>(null);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const bootstrap = await import('@public/data/bootstrap.json');
        const timestamp = (bootstrap as any).dataVersion;

        const dataUrl = `/data/data.${timestamp}.json`;
        const searchUrl = `/data/search.${timestamp}.json`;

        const [dataRes, searchRes] = await Promise.all([
          fetch(dataUrl),
          fetch(searchUrl),
        ]);

        const dataModule = await dataRes.json();
        const searchIndexModule = await searchRes.json();

        const { correspondences: correspondenceData } = dataModule;

        const all = new Fuse<CorrespondenceCard>(correspondenceData ?? [], {
          threshold: 0.3,
          isCaseSensitive: false,
          keys: [
            { name: 'letters.title', weight: 0.2 },
            { name: 'reason.category', weight: 0.15 },
            { name: 'recipient.firstName', weight: 0.1 },
            { name: 'recipient.fullName', weight: 0.15 },
            { name: 'recipient.lastName', weight: 0.1 },
            { name: 'title', weight: 0.3 },
          ],
        });

        const correspondences = new Fuse<CorrespondenceSearchItem>(
          searchIndexModule.correspondences ?? [],
          {
            keys: ['title'],
            threshold: 0.3,
          },
        );

        const recipients = new Fuse<RecipientSearchItem>(
          searchIndexModule.recipients ?? [],
          {
            keys: ['firstName', 'lastName', 'fullName'],
            threshold: 0.3,
          },
        );

        const letters = new Fuse<LetterSearchItem>(
          searchIndexModule.letters ?? [],
          {
            keys: ['title'],
            threshold: 0.3,
          },
        );

        setFuseMap({ all, correspondences, recipients, letters });
      } catch (err) {
        console.error('Failed to load search data:', err);
      }
    };

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
};
