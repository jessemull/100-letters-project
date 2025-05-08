import { useState, useCallback, useEffect, useMemo } from 'react';
import useSWR, { mutate as globalMutate, SWRConfiguration } from 'swr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface UseSWRQueryOptions<T> {
  path: string | null;
  token: string | null;
  config?: SWRConfiguration;
  skip?: boolean;
  merge?: (prev: unknown | null, page: unknown) => T;
}

export function defaultMerge<T>(prev: unknown | null, page: unknown) {
  if (!prev) {
    return page as T;
  }
  return {
    ...(page as T),
    data: [
      ...(prev as { data: unknown[] }).data,
      ...(page as { data: unknown[] }).data,
    ],
  } as T;
}

export function useSWRQuery<T = any>({
  path,
  token,
  config,
  skip = false,
  merge = defaultMerge<T>,
}: UseSWRQueryOptions<T>) {
  const [loadingMore, setLoadingMore] = useState(false);
  const [mergedData, setMergedData] = useState<T>();

  const fetcher = useMemo(
    () =>
      token
        ? async (url: string) => {
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

              throw error;
            }

            return res.json();
          }
        : null,
    [token],
  );

  const fullUrl = !skip && token && path ? `${API_BASE_URL}${path}` : null;

  const { data, error, isLoading, mutate } = useSWR<T>(
    fullUrl,
    fetcher,
    config,
  );

  useEffect(() => {
    if (data) {
      setMergedData(data);
    }
  }, [data]);

  const fetchMore = useCallback(
    async (newPath: string) => {
      if (!token) return;

      setLoadingMore(true);

      try {
        const url = `${API_BASE_URL}${newPath}`;
        const nextPageData = await fetcher!(url);
        setMergedData((prevData) => {
          const nextData = merge(prevData, nextPageData);
          setTimeout(() => {
            globalMutate(fullUrl, nextData, false);
          }, 0);
          return nextData;
        });
      } catch (err) {
        console.error('Error fetching more: ', err);
      } finally {
        setLoadingMore(false);
      }
    },
    [token, merge, fullUrl, fetcher],
  );

  return {
    data: mergedData,
    error,
    isLoading,
    loadingMore,
    fetchMore,
    mutate,
  };
}
