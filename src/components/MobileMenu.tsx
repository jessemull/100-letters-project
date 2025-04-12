'use client';

import Link from 'next/link';
import { FC } from 'react';
import { Home, Info, LogIn, LogOut, Mail, Shield, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
      className="fixed top-0 left-0 w-full h-full bg-gray-900 text-white z-50 md:hidden overflow-hidden"
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
      <nav className="flex flex-col space-y-6 px-6 py-6 text-lg">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center space-x-3 hover:text-gray-400"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center space-x-3 hover:text-gray-400"
        >
          <Info className="h-5 w-5" />
          <span>About</span>
        </Link>
        <Link
          href="/contact"
          onClick={onClose}
          className="flex items-center space-x-3 hover:text-gray-400"
        >
          <Mail className="h-5 w-5" />
          <span>Contact</span>
        </Link>
        {isLoggedIn && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center space-x-3 hover:text-gray-400"
          >
            <Shield className="h-5 w-5" />
            <span>Admin</span>
          </Link>
        )}
        {isLoggedIn ? (
          <button
            onClick={() => {
              handleLogout();
              onClose();
            }}
            className="flex items-center space-x-3 text-left text-red-200 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        ) : (
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center space-x-3 hover:text-gray-400"
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
        )}
      </nav>
    </motion.div>
  );
};

export default MobileMenu;
