'use client';

import { createContext, useContext, useState } from 'react';

type DesktopMenuProvider = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

export const DesktopMenuContext = createContext<
  DesktopMenuProvider | undefined
>(undefined);

export const DesktopMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <DesktopMenuContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </DesktopMenuContext.Provider>
  );
};

export const useDesktopMenu = () => {
  const context = useContext(DesktopMenuContext);
  if (!context) {
    throw new Error(
      'The useDesktopMenu hook must be used within a DesktopMenuProvider!',
    );
  }
  return context;
};
