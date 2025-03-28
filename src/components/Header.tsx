'use client';

import { Menu, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white px-4 py-3 font-merriweather sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center max-w-full">
        <button className="md:hidden">
          <Menu className="h-6 w-6 text-white" />
        </button>
        <div className="flex items-center space-x-3">
          <img src="/favicon.svg" alt="Logo" className="h-8 w-8" />
          <div className="text-2xl whitespace-nowrap pr-4">
            100 Letters Project
          </div>
          <nav className="hidden md:flex space-x-7">
            <a href="#" className="hover:text-gray-400">
              Home
            </a>
            <a href="#" className="hover:text-gray-400">
              About
            </a>
            <a href="#" className="hover:text-gray-400">
              Contact
            </a>
          </nav>
        </div>
        <User className="h-6 w-6 text-white" />
      </div>
    </header>
  );
};

export default Header;
