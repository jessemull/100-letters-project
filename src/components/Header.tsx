'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthProvider';

const Header = () => {
  const { isLoggedIn, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

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
        {isLoggedIn ? (
          <div className="flex space-x-4">
            <Link href="/admin" className="hover:text-gray-400">
              Admin
            </Link>
            <LogOut
              className="h-6 w-6 text-white cursor-pointer"
              data-testid="logout-icon"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <Link href="/login" aria-label="Login">
            <LogIn className="h-6 w-6 text-white" data-testid="login-icon" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
