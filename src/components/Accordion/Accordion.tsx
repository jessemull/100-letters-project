'use client';

import { useState, createContext, ReactNode } from 'react';

type AccordionContextType = {
  collapsible: boolean;
  openItem: string | null;
  setOpenItem: (val: string | null) => void;
};

export const AccordionContext = createContext<AccordionContextType | null>(
  null,
);

interface Props {
  children: ReactNode;
  collapsible?: boolean;
  className?: string;
}

const Accordion: React.FC<Props> = ({
  children,
  className = '',
  collapsible = false,
}) => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem, collapsible }}>
      <div
        className={`bg-white/10 border border-white rounded-xl overflow-hidden divide-y divide-white/20 ${className}`}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export default Accordion;
