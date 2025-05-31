'use client';

import { CorrespondenceContextType } from '@ts-types/context';
import { createContext, useContext, ReactNode } from 'react';

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
