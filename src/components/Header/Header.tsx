'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { MobileMenu } from '@components/Header';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const { isLoggedIn, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="bg-gray-900 text-white px-4 py-3 font-merriweather sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center max-w-full">
        <button aria-label="Open Menu" className="md:hidden">
          <Menu
            className="h-6 w-6 text-white"
            data-testid="open-menu"
            onClick={() => setIsMenuOpen(true)}
          />
        </button>
        <div className="flex items-center space-x-3">
          <Image src="/favicon.svg" alt="Logo" height={32} width={32} />
          <Link href="/" className="text-2xl whitespace-nowrap md:pr-4">
            100 Letters Project
          </Link>
          <nav className="hidden md:flex space-x-7">
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-400">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-400">
              Contact
            </Link>
            {isLoggedIn && (
              <Link href="/admin" className="hover:text-gray-400">
                Admin
              </Link>
            )}
          </nav>
        </div>
        {isLoggedIn ? (
          <LogOut
            className="h-6 w-6 text-white cursor-pointer"
            data-testid="logout-icon"
            onClick={handleLogout}
          />
        ) : (
          <Link href="/login" aria-label="Login">
            <LogIn className="h-6 w-6 text-white" data-testid="login-icon" />
          </Link>
        )}
      </div>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
