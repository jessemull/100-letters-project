'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white px-4 py-3 font-merriweather sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center max-w-full">
        <button aria-label="Open Menu" className="md:hidden">
          <Menu className="h-6 w-6 text-white" />
        </button>
        <div className="flex items-center space-x-3">
          <Image src="/favicon.svg" alt="Logo" height={32} width={32} />
          <div className="text-2xl whitespace-nowrap pr-4">
            100 Letters Project
          </div>
          <nav className="hidden md:flex space-x-7">
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
            <Link href="/" className="hover:text-gray-400">
              About
            </Link>
            <Link href="/" className="hover:text-gray-400">
              Contact
            </Link>
          </nav>
        </div>
        <User className="h-6 w-6 text-white" data-testid="user-icon" />
      </div>
    </header>
  );
};

export default Header;
