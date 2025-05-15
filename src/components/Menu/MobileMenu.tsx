'use client';

import Image from 'next/image';
import MenuNavItems from './MenuNavItems';
import { FC } from 'react';
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
  if (!isOpen) return null;

  return (
    <motion.div
      className={`
        fixed top-0 left-0 h-full bg-gray-900 text-white z-50
        w-full sm:w-[50%] md:w-[50%] max-w-md
        overflow-hidden lg:hidden
      `}
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween' }}
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
    </motion.div>
  );
};

export default MobileMenu;
