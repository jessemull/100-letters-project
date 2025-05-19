// Accordion.tsx
'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

type AccordionContextType = {
  openItem: string | null;
  setOpenItem: (val: string | null) => void;
  collapsible: boolean;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

const Accordion = ({
  children,
  collapsible = false,
  className = '',
}: {
  children: ReactNode;
  collapsible?: boolean;
  className?: string;
}) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem, collapsible }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({
  value,
  label,
  children,
}: {
  value: string;
  label: ReactNode;
  children: ReactNode;
}) => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used within Accordion');

  const isOpen = ctx.openItem === value;

  const toggle = () => {
    if (isOpen && ctx.collapsible) {
      ctx.setOpenItem(null);
    } else {
      ctx.setOpenItem(value);
    }
  };

  return (
    <div className="border-b border-white/20">
      <button
        onClick={toggle}
        className="w-full text-left font-medium px-4 py-3 hover:bg-white/10"
      >
        {label}
      </button>
      {isOpen && <div className="px-4 py-2">{children}</div>}
    </div>
  );
};

export default Accordion;
