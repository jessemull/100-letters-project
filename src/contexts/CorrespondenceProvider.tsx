'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Correspondence, CorrespondencesMap } from '@ts-types/correspondence';

interface CorrespondenceContextType {
  correspondences: Correspondence[];
  correspondencesById: CorrespondencesMap;
  earliestSentAtDate: string;
  responseCompletion: number;
  loading: boolean;
}

const defaultValue: CorrespondenceContextType = {
  correspondences: [],
  correspondencesById: {},
  earliestSentAtDate: '',
  responseCompletion: 0,
  loading: true,
};

export const CorrespondenceContext =
  createContext<CorrespondenceContextType>(defaultValue);

export const CorrespondenceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [correspondences, setCorrespondences] = useState<Correspondence[]>([]);
  const [correspondencesById, setCorrespondencesById] =
    useState<CorrespondencesMap>({});
  const [earliestSentAtDate, setEarliestSentAtDate] = useState('');
  const [responseCompletion, setResponseCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const dataModule = await import('../data/data.json');
      const data = dataModule.default ?? dataModule;

      setCorrespondences((data.correspondences ?? []) as Correspondence[]);
      setCorrespondencesById(
        (data.correspondencesById ?? {}) as CorrespondencesMap,
      );
      setEarliestSentAtDate(data.earliestSentAtDate ?? '');
      setResponseCompletion(data.responseCompletion ?? 0);
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <CorrespondenceContext.Provider
      value={{
        correspondences,
        correspondencesById,
        earliestSentAtDate,
        responseCompletion,
        loading,
      }}
    >
      {loading ? <div>Loading data...</div> : children}
    </CorrespondenceContext.Provider>
  );
};

export const useCorrespondence = () => useContext(CorrespondenceContext);
