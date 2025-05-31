'use client';

import { CorrespondenceContextType } from '@ts-types/context';
import { createContext, useContext, ReactNode } from 'react';

export const CorrespondenceContext = createContext<CorrespondenceContextType>({
  correspondences: [],
  correspondencesById: {},
  earliestSentAtDate: '',
});

export const CorrespondenceProvider = ({
  children,
  correspondences,
  correspondencesById,
  earliestSentAtDate,
}: { children: ReactNode } & CorrespondenceContextType) => {
  return (
    <CorrespondenceContext.Provider
      value={{
        correspondences,
        correspondencesById,
        earliestSentAtDate,
      }}
    >
      {children}
    </CorrespondenceContext.Provider>
  );
};

export const useCorrespondence = () => useContext(CorrespondenceContext);
