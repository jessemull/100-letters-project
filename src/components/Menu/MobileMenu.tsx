'use client';

import Image from 'next/image';
import {
  CorrespondenceSearch,
  LetterSearch,
  MenuNavItems,
  RecipientSearch,
} from '@components/Menu';
import { FC, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  handleLogout: () => Promise<void>;
  isLoggedIn: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  handleLogout,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className={`
        fixed top-0 left-0 h-full bg-gray-900 text-white z-50
        w-full sm:w-[50%] md:w-[50%] max-w-md
        overflow-y-auto lg:hidden
      `}
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween' }}
      ref={menuRef}
    >
      <div
        className="flex justify-between items-center px-4 py-3 border-b border-gray-700"
        data-testid="mobile-menu"
      >
        <div className="flex items-center justify-start space-x-4">
          <Image src="/favicon.svg" alt="Logo" height={32} width={32} />
          <span className="text-xl">100 Letters Project</span>
        </div>
        <button onClick={onClose} aria-label="Close Menu">
          <X className="h-6 w-6" data-testid="close-menu" />
        </button>
      </div>
      <nav
        aria-label="Mobile Navigation"
        className="flex flex-col space-y-6 px-6 py-6 text-lg"
      >
        <MenuNavItems
          collapsed={false}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          onNavigate={onClose}
        />
      </nav>
      <div className="flex flex-col mt-4">
        <div className="px-4">
          <RecipientSearch onClick={onClose} />
        </div>
        <hr className="border-t border-white w-full my-4" />
        <div className="px-4">
          <LetterSearch onClick={onClose} />
        </div>
        <hr className="border-t border-white w-full my-4" />
        <div className="px-4">
          <CorrespondenceSearch onClick={onClose} />
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
