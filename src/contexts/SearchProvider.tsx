'use client';

import { SearchContextType, SearchData } from '@ts-types/context';
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
  loading: true,
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    correspondences: [],
    recipients: [],
    letters: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const bootstrap = await import('@public/data/bootstrap.json');
        const searchUrl = `/data/search.${(bootstrap as any).dataVersion}.json`;

        const res = await fetch(searchUrl);
        const data = await res.json();

        setSearchData({
          correspondences: data.correspondences ?? [],
          recipients: data.recipients ?? [],
          letters: data.letters ?? [],
        });
      } catch (err) {
        console.error('Failed to load search data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSearchData();
  }, []);

  return (
    <SearchContext.Provider value={{ ...searchData, loading }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchData = () => useContext(SearchContext);
