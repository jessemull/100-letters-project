'use client';

import Link from 'next/link';
import { Home, Info, Mail, Shield, LogIn, LogOut } from 'lucide-react';
import { useMemo } from 'react';

const baseClass = 'flex items-center hover:text-gray-400 transition-colors';
const iconClass = 'h-5 w-5 shrink-0';

const MenuNavItems = ({
  isLoggedIn,
  handleLogout,
  collapsed,
  onNavigate = () => {},
}: {
  isLoggedIn: boolean;
  handleLogout: () => void;
  collapsed: boolean;
  onNavigate?: () => void;
}) => {
  const collapsedClass = useMemo(
    () => (collapsed ? 'justify-center' : 'space-x-3 justify-start'),
    [collapsed],
  );

  const linkClass = useMemo(
    () => `${baseClass} ${collapsedClass}`,
    [collapsedClass],
  );

  const handleNavClick = () => {
    onNavigate();
  };

  return (
    <>
      <Link
        aria-label="Home"
        href="/"
        onClick={handleNavClick}
        className={linkClass}
      >
        <Home className={iconClass} />
        {!collapsed && <span>Home</span>}
      </Link>
      <Link
        aria-label="About"
        href="/about"
        onClick={handleNavClick}
        className={linkClass}
      >
        <Info className={iconClass} />
        {!collapsed && <span>About</span>}
      </Link>
      <Link
        aria-label="Contact"
        href="/contact"
        onClick={handleNavClick}
        className={linkClass}
      >
        <Mail className={iconClass} />
        {!collapsed && <span>Contact</span>}
      </Link>
      {isLoggedIn && (
        <Link
          aria-label="Admin"
          href="/admin"
          onClick={handleNavClick}
          className={linkClass}
        >
          <Shield className={iconClass} />
          {!collapsed && <span>Admin</span>}
        </Link>
      )}
      {isLoggedIn ? (
        <button
          aria-label="Logout"
          onClick={handleLogout}
          className={`${baseClass} ${collapsed ? 'justify-center' : 'space-x-3 justify-start'}`}
        >
          <LogOut className={iconClass} />
          {!collapsed && <span>Logout</span>}
        </button>
      ) : (
        <Link
          aria-label="Login"
          href="/login"
          onClick={handleNavClick}
          className={linkClass}
        >
          <LogIn className={iconClass} />
          {!collapsed && <span>Login</span>}
        </Link>
      )}
    </>
  );
};

export default MenuNavItems;
