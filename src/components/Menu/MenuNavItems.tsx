'use client';

import Link from 'next/link';
import { Home, Info, Mail, Shield, LogIn, LogOut } from 'lucide-react';
import { baseMenuClass, iconMenuClass } from '@constants/menu';
import { useMemo } from 'react';

interface Props {
  isLoggedIn: boolean;
  handleLogout: () => void;
  collapsed: boolean;
  onNavigate?: () => void;
}

const MenuNavItems: React.FC<Props> = ({
  collapsed,
  handleLogout,
  isLoggedIn,
  onNavigate = () => {},
}) => {
  const collapsedClass = useMemo(
    () => (collapsed ? 'justify-center' : 'space-x-3 justify-start'),
    [collapsed],
  );

  const linkClass = useMemo(
    () => `${baseMenuClass} ${collapsedClass}`,
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
        <Home className={iconMenuClass} />
        {!collapsed ? <span>Home</span> : <span className="sr-only">Home</span>}
      </Link>
      <Link
        aria-label="About"
        href="/about"
        onClick={handleNavClick}
        className={linkClass}
      >
        <Info className={iconMenuClass} />
        {!collapsed ? (
          <span>About</span>
        ) : (
          <span className="sr-only">About</span>
        )}
      </Link>
      <Link
        aria-label="Contact"
        href="/contact"
        onClick={handleNavClick}
        className={linkClass}
      >
        <Mail className={iconMenuClass} />
        {!collapsed ? (
          <span>Contact</span>
        ) : (
          <span className="sr-only">Contact</span>
        )}
      </Link>
      {isLoggedIn && (
        <Link
          aria-label="Admin"
          href="/admin"
          onClick={handleNavClick}
          className={linkClass}
        >
          <Shield className={iconMenuClass} />
          {!collapsed ? (
            <span>Admin</span>
          ) : (
            <span className="sr-only">Admin</span>
          )}
        </Link>
      )}
      {isLoggedIn ? (
        <button
          aria-label="Logout"
          onClick={handleLogout}
          className={`${baseMenuClass} ${collapsed ? 'justify-center' : 'space-x-3 justify-start'}`}
        >
          <LogOut className={iconMenuClass} />
          {!collapsed ? (
            <span>Logout</span>
          ) : (
            <span className="sr-only">Logout</span>
          )}
        </button>
      ) : (
        <Link
          aria-label="Login"
          href="/login"
          onClick={handleNavClick}
          className={linkClass}
        >
          <LogIn className={iconMenuClass} />
          {!collapsed ? (
            <span>Login</span>
          ) : (
            <span className="sr-only">Login</span>
          )}
        </Link>
      )}
    </>
  );
};

export default MenuNavItems;
