'use client';

import React, { ReactNode, createContext, useCallback, useState } from 'react';

type DrawerContextType = {
  close: () => void;
  isOpen: boolean;
  open: () => void;
};

export const DrawerContext = createContext<DrawerContextType | null>(null);

const Drawer = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DrawerContext.Provider>
  );
};

export default Drawer;
