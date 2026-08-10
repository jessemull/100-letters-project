'use client';

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
import { getCategoryEnum } from '@util/search';
import type { BootstrapData } from '@ts-types/bootstrap';

export type UseSearchState = {
  error: string | null;
  loading: boolean;
  results: SearchResult[];
};

export const useSearch = ({
  type,
  term,
  limit = 100,
  isExactCategory = false,
  enabled = true,
}: SearchOptions): UseSearchState => {
  const [fuseMap, setFuseMap] = useState<FuseMap | null>(null);
  const [correspondenceData, setCorrespondenceData] = useState<
    CorrespondenceCard[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [indexLoading, setIndexLoading] = useState(false);
  const loading = enabled && indexLoading;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const loadSearchData = async () => {
      try {
        const Fuse = (await import('fuse.js')).default;
        if (cancelled) return;
        setIndexLoading(true);

        const bootstrapModule =
          (await import('@public/data/bootstrap.json')) as BootstrapData;
        const timestamp = bootstrapModule.dataVersion;

        const dataUrl = `/data/data.${timestamp}.json`;
        const searchUrl = `/data/search.${timestamp}.json`;

        const [dataRes, searchRes] = await Promise.all([
          fetch(dataUrl),
          fetch(searchUrl),
        ]);

        if (!dataRes.ok) {
          throw new Error(
            `Failed to load correspondence data (${dataRes.status})`,
          );
        }
        if (!searchRes.ok) {
          throw new Error(`Failed to load search index (${searchRes.status})`);
        }

        const dataModule = await dataRes.json();
        const searchIndexModule = await searchRes.json();

        if (cancelled) return;

        const { correspondences: correspondenceData } = dataModule;
        setCorrespondenceData(correspondenceData ?? []);

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
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load search data:', err);
        setError('Failed to load search data.');
        setFuseMap(null);
      } finally {
        if (!cancelled) {
          setIndexLoading(false);
        }
      }
    };

    void loadSearchData();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const results = useMemo(() => {
    if (!enabled) return [];
    if (!term.trim()) return [];
    if (!fuseMap) return [];

    const categoryEnum = getCategoryEnum(term.trim());
    if (categoryEnum && type === 'all' && isExactCategory) {
      return correspondenceData
        .filter(
          (correspondence) => correspondence.reason?.category === categoryEnum,
        )
        .slice(0, limit);
    }

    const fuse = fuseMap[type];
    return fuse
      ? fuse
          .search(term)
          .slice(0, limit)
          .map((r) => r.item)
      : [];
  }, [
    enabled,
    type,
    term,
    limit,
    fuseMap,
    correspondenceData,
    isExactCategory,
  ]);

  return { results, error, loading };
};
