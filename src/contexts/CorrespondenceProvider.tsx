'use client';

import { Correspondence } from '@ts-types/correspondence';
import { Letter } from '@ts-types/letter';
import { Recipient } from '@ts-types/recipients';
import { createContext, useContext, ReactNode } from 'react';

export interface CorrespondenceContextType {
  correspondences: Correspondence[];
  letters: Letter[];
  recipients: Recipient[];
}

export const CorrespondenceContext = createContext<CorrespondenceContextType>({
  correspondences: [],
  letters: [],
  recipients: [],
});

export const CorrespondenceProvider = ({
  children,
  correspondences,
  letters,
  recipients,
}: { children: ReactNode } & CorrespondenceContextType) => {
  return (
    <CorrespondenceContext.Provider
      value={{ correspondences, letters, recipients }}
    >
      {children}
    </CorrespondenceContext.Provider>
  );
};

export const useCorrespondence = () => useContext(CorrespondenceContext);
