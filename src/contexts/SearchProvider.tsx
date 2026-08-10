'use client';

import { SearchContextType, SearchData } from '@ts-types/context';
import type { BootstrapData } from '@ts-types/bootstrap';
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';

export const SearchContext = createContext<SearchContextType>({
  correspondences: [],
  recipients: [],
  letters: [],
  error: null,
  loading: true,
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    correspondences: [],
    recipients: [],
    letters: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const bootstrapModule =
          (await import('@public/data/bootstrap.json')) as BootstrapData;
        const searchUrl = `/data/search.${bootstrapModule.dataVersion}.json`;

        const res = await fetch(searchUrl);
        if (!res.ok) {
          throw new Error(`Failed to load search data (${res.status})`);
        }
        const data = await res.json();

        setSearchData({
          correspondences: data.correspondences ?? [],
          recipients: data.recipients ?? [],
          letters: data.letters ?? [],
        });
        setError(null);
      } catch (err) {
        console.error('Failed to load search data:', err);
        setError('Failed to load search data.');
      } finally {
        setLoading(false);
      }
    };

    loadSearchData();
  }, []);

  return (
    <SearchContext.Provider value={{ ...searchData, error, loading }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchData = () => useContext(SearchContext);
