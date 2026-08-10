'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import bootstrapJson from '@public/data/bootstrap.json';
import {
  CorrespondenceCard,
  CorrespondencesMap,
} from '@ts-types/correspondence';
import type { BootstrapData } from '@ts-types/bootstrap';

const bootstrap = bootstrapJson as BootstrapData;

const { correspondences: initialCorrespondences } = bootstrap;

export const CorrespondenceContext = createContext({
  correspondences: [] as CorrespondenceCard[],
  correspondencesById: {} as CorrespondencesMap,
  error: null as string | null,
  loading: true,
});

export const useCorrespondence = () => useContext(CorrespondenceContext);

// We include the first three correspondences, count and date as part of the bundle. Then lazy load the rest to improve performance and keep the bundle size minimal.

export const CorrespondenceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [correspondences, setCorrespondences] = useState<CorrespondenceCard[]>(
    initialCorrespondences as CorrespondenceCard[],
  );
  const [correspondencesById, setCorrespondencesById] =
    useState<CorrespondencesMap>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataUrl = `/data/data.${bootstrap.dataVersion}.json`;
        const res = await fetch(dataUrl);
        if (!res.ok) {
          throw new Error(`Failed to load correspondence data (${res.status})`);
        }
        const data = await res.json();
        setCorrespondences(data.correspondences ?? initialCorrespondences);
        setCorrespondencesById(data.correspondencesById ?? {});
        setError(null);
      } catch (err) {
        console.error('Failed to load correspondence data: ', err);
        setError('Failed to load correspondence data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <CorrespondenceContext.Provider
      value={{
        correspondences,
        correspondencesById,
        error,
        loading,
      }}
    >
      {children}
    </CorrespondenceContext.Provider>
  );
};
