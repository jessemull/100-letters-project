'use client';

import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import ReactDOM from 'react-dom';

type DrawerContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
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

import { ReactElement } from 'react';

export const DrawerTrigger = ({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: ReactElement<any>;
}) => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('DrawerTrigger must be used within a Drawer');

  const trigger = () => {
    ctx.open();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as ReactElement<any>, {
      onClick: trigger,
    });
  }

  return <button onClick={trigger}>{children}</button>;
};

export const DrawerContent = ({ children }: { children: ReactNode }) => {
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

export default Drawer;
