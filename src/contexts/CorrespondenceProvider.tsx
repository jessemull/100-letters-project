'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import bootstrap from '@public/data/bootstrap.json';
import {
  CorrespondenceCard,
  CorrespondencesMap,
} from '@ts-types/correspondence';

const { correspondences: initialCorrespondences } = bootstrap;

export const CorrespondenceContext = createContext({
  correspondences: [] as CorrespondenceCard[],
  correspondencesById: {} as CorrespondencesMap,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataUrl = `/data/data.${(bootstrap as any).dataVersion}.json`;
        const res = await fetch(dataUrl);
        const data = await res.json();
        setCorrespondences(data.correspondences ?? []);
        setCorrespondencesById(data.correspondencesById ?? {});
      } catch (err) {
        console.error('Failed to load correspondence data: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [correspondences.length]);

  return (
    <CorrespondenceContext.Provider
      value={{
        correspondences,
        correspondencesById,
        loading,
      }}
    >
      {children}
    </CorrespondenceContext.Provider>
  );
};
