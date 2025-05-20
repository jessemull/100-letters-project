'use client';

import { AccordionContext } from './Accordion';
import { ChevronDown } from 'lucide-react';
import { ReactNode, useContext } from 'react';

interface Props {
  children: ReactNode;
  label: ReactNode;
  value: string;
}

const AccordionItem: React.FC<Props> = ({ children, label, value }) => {
  const ctx = useContext(AccordionContext);

  if (!ctx) throw new Error('AccordionItem must be used within Accordion!');

  const isOpen = ctx.openItem === value;

  const toggle = () => {
    if (isOpen && ctx.collapsible) {
      ctx.setOpenItem(null);
    } else {
      ctx.setOpenItem(value);
    }
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="w-full text-left font-medium px-4 py-3 hover:bg-white/5 flex items-center justify-between transition-colors"
      >
        <span>{label}</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } text-current`}
          size={20}
        />
      </button>
      {isOpen && <div className="px-4 py-2">{children}</div>}
    </div>
  );
};

export default AccordionItem;
