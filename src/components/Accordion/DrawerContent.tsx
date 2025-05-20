'use client';

import ReactDOM from 'react-dom';
import { DrawerContext } from './Drawer';
import { ReactNode, useContext, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

const DrawerContent: React.FC<Props> = ({ children }) => {
  const ctx = useContext(DrawerContext);

  if (!ctx) throw new Error('DrawerContent must be used within a Drawer');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ctx.isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-zinc-900 text-white rounded-lg p-6 max-w-lg w-full relative shadow-xl">
        <button
          onClick={ctx.close}
          className="absolute top-4 right-4 text-white hover:text-red-400"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default DrawerContent;
