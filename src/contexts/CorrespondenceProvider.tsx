'use client';
import { createContext, useContext, ReactNode } from 'react';
import { Correspondence, Letter, Recipient } from '../types';

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
