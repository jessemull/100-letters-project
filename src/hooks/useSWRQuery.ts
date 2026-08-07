'use client';

import useSWR, { mutate as globalMutate } from 'swr';
import { UseSWRQueryOptions } from '@ts-types/hooks';
import { defaultMerge } from '@util/cache';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSWRQuery = <T = any>({
  path,
  token,
  config,
  skip = false,
  merge = defaultMerge<T>,
}: UseSWRQueryOptions<T>) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const [mergedOverride, setMergedOverride] = useState<T>();
  const [trackedPath, setTrackedPath] = useState(path);
  const [unauthorized, setUnauthorized] = useState(false);
  const router = useRouter();

  // Reset pagination merge when the query path changes.
  if (path !== trackedPath) {
    setTrackedPath(path);
    setMergedOverride(undefined);
  }

  const fetcher = useMemo(() => {
    if (!token) return null;

    return async (url: string) => {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        let errorBody;
        try {
          errorBody = await res.json();
        } catch {
          errorBody = { message: res.statusText };
        }

        const error = new Error(
          errorBody?.message || `Error ${res.status}: ${res.statusText}`,
        ) as Error & {
          status?: number;
          info?: any;
        };

        error.status = res.status;
        error.info = errorBody;

        if (res.status === 401) {
          setUnauthorized(true);
        }

        throw error;
      }

      return res.json();
    };
  }, [token]);

  useEffect(() => {
    if (unauthorized) {
      router.push('/login');
    }
  }, [unauthorized, router]);

  const fullUrl = !skip && token && path ? `${API_BASE_URL}${path}` : null;

  const { data, error, isLoading, mutate } = useSWR<T>(
    fullUrl,
    fetcher,
    config,
  );

  const resolvedData = mergedOverride ?? data;

  const fetchMore = useCallback(
    async (newPath: string) => {
      if (!token) return;

      setLoadingMore(true);

      try {
        const url = `${API_BASE_URL}${newPath}`;
        const nextPageData = await fetcher!(url);
        setMergedOverride((prevData) => {
          const nextData = merge(prevData ?? data, nextPageData);
          setTimeout(() => {
            globalMutate(fullUrl, nextData, false);
          }, 0);
          return nextData;
        });
      } catch (err: any) {
        if (err?.status === 401) {
          setUnauthorized(true);
        } else {
          console.error('Error fetching more: ', err);
        }
      } finally {
        setLoadingMore(false);
      }
    },
    [token, merge, fullUrl, fetcher, data],
  );

  return {
    data: resolvedData,
    error,
    isLoading,
    loadingMore,
    fetchMore,
    mutate,
  };
};
