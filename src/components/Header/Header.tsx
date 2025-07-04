'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { MobileMenu } from '@components/Menu';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SearchProvider } from '@contexts/SearchProvider';

const stripeURL =
  process.env.NEXT_PUBLIC_STRIPE_URL ||
  'https://donate.stripe.com/test_7sY4gB6Ns7rU3bl7TVcQU00';

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
    <header className="bg-gray-900 text-white px-4 py-3 font-merriweather sticky top-0 z-50 w-full h-[56px]">
      <div className="flex justify-between items-center max-w-full">
        <button aria-label="Open Menu" className="lg:hidden">
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
          <nav className="hidden lg:flex text-lg space-x-7">
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-400">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-400">
              Contact
            </Link>
            <Link
              href={stripeURL}
              className="hover:text-gray-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate
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
      <SearchProvider>
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
      </SearchProvider>
    </header>
  );
};

export default Header;
