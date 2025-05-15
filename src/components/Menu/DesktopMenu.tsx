'use client';

import MenuNavItems from './MenuNavItems';
import { useAuth } from '@contexts/AuthProvider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DesktopMenu = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) => {
  const { isLoggedIn, signOut } = useAuth();

  return (
    <aside
      className={`
    hidden font-merriweather lg:flex flex-col bg-gray-800 text-white transition-all duration-300 bg-white/20
    ${collapsed ? 'w-16' : 'w-80'}
    top-14 left-0 bottom-0
    overflow-y-auto
    h-full
  `}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white-400">
        {!collapsed && (
          <span className="text-lg whitespace-nowrap">Find Letters</span>
        )}
        <button
          aria-label="Toggle Menu"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white ml-auto"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav
        aria-label="Desktop Navigation"
        className="flex flex-col gap-6 p-4 text-sm"
      >
        <MenuNavItems
          isLoggedIn={isLoggedIn}
          handleLogout={signOut}
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
};

export default DesktopMenu;
