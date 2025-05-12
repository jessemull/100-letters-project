'use client';

import { Correspondence } from '@ts-types/correspondence';
import { Letter } from '@ts-types/letter';
import { Recipient } from '@ts-types/recipients';
import { createContext, useContext, ReactNode } from 'react';

export interface CorrespondenceContextType {
  correspondences: Correspondence[];
  earliestSentAtDate: string;
  letters: Letter[];
  recipients: Recipient[];
  responseCompletion: number;
}

export const CorrespondenceContext = createContext<CorrespondenceContextType>({
  correspondences: [],
  earliestSentAtDate: '',
  letters: [],
  recipients: [],
  responseCompletion: 0.0,
});

export const CorrespondenceProvider = ({
  children,
  correspondences,
  earliestSentAtDate,
  letters,
  recipients,
  responseCompletion,
}: { children: ReactNode } & CorrespondenceContextType) => {
  return (
    <CorrespondenceContext.Provider
      value={{
        correspondences,
        earliestSentAtDate,
        letters,
        recipients,
        responseCompletion,
      }}
    >
      {children}
    </CorrespondenceContext.Provider>
  );
};

export const useCorrespondence = () => useContext(CorrespondenceContext);
