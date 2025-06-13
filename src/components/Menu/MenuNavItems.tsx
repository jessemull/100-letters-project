'use client';

import Link from 'next/link';
import {
  Home,
  Info,
  Mail,
  Shield,
  LogIn,
  LogOut,
  HandHelping,
} from 'lucide-react';
import { baseMenuClass, iconMenuClass } from '@constants/menu';
import { useMemo } from 'react';

const stripeURL = process.env.NEXT_PUBLIC_STRIPE_URL as string;

interface Props {
  collapsed: boolean;
  handleLogout: () => void;
  isLoggedIn: boolean;
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

  const renderIconWithTooltip = (
    IconComponent: React.ComponentType<any>,
    label: string,
  ) =>
    collapsed ? (
      <span title={label}>
        <IconComponent className={iconMenuClass} />
      </span>
    ) : (
      <IconComponent className={iconMenuClass} />
    );

  return (
    <>
      <Link
        aria-label="Home"
        href="/"
        onClick={handleNavClick}
        className={linkClass}
      >
        {renderIconWithTooltip(Home, 'Home')}
        {!collapsed ? <span>Home</span> : <span className="sr-only">Home</span>}
      </Link>
      <Link
        aria-label="About"
        href="/about"
        onClick={handleNavClick}
        className={linkClass}
      >
        {renderIconWithTooltip(Info, 'About')}
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
        {renderIconWithTooltip(Mail, 'Contact')}
        {!collapsed ? (
          <span>Contact</span>
        ) : (
          <span className="sr-only">Contact</span>
        )}
      </Link>
      <Link
        aria-label="Donate"
        href={stripeURL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {renderIconWithTooltip(HandHelping, 'Donate')}
        {!collapsed ? (
          <span>Donate</span>
        ) : (
          <span className="sr-only">Donate</span>
        )}
      </Link>
      {isLoggedIn && (
        <Link
          aria-label="Admin"
          href="/admin"
          onClick={handleNavClick}
          className={linkClass}
        >
          {renderIconWithTooltip(Shield, 'Admin')}
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
          title={collapsed ? 'Logout' : undefined}
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
          {renderIconWithTooltip(LogIn, 'Login')}
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
