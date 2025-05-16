'use client';

import { Correspondence, CorrespondencesMap } from '@ts-types/correspondence';
import { createContext, useContext, ReactNode } from 'react';

export interface CorrespondenceContextType {
  correspondences: Correspondence[];
  correspondencesById: CorrespondencesMap;
  earliestSentAtDate: string;
  responseCompletion: number;
}

export const CorrespondenceContext = createContext<CorrespondenceContextType>({
  correspondences: [],
  correspondencesById: {},
  earliestSentAtDate: '',
  responseCompletion: 0.0,
});

export const CorrespondenceProvider = ({
  children,
  correspondences,
  correspondencesById,
  earliestSentAtDate,
  responseCompletion,
}: { children: ReactNode } & CorrespondenceContextType) => {
  return (
    <CorrespondenceContext.Provider
      value={{
        correspondences,
        correspondencesById,
        earliestSentAtDate,
        responseCompletion,
      }}
    >
      {children}
    </CorrespondenceContext.Provider>
  );
};

export const useCorrespondence = () => useContext(CorrespondenceContext);
