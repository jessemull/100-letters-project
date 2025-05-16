'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CorrespondenceSearch,
  LetterSearch,
  MenuNavItems,
  RecipientSearch,
} from '@components/Menu';
import { useAuth } from '@contexts/AuthProvider';

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
        className="flex flex-col gap-4 text-sm" // removed p-4 here
      >
        <div className="flex flex-col gap-4 text-sm px-4 pt-4">
          <MenuNavItems
            isLoggedIn={isLoggedIn}
            handleLogout={signOut}
            collapsed={collapsed}
          />
        </div>
        {!collapsed && (
          <div className="flex flex-col mt-4">
            <div className="px-4">
              <RecipientSearch />
            </div>
            <hr className="border-t border-white w-full my-4" />
            <div className="px-4">
              <LetterSearch />
            </div>
            <hr className="border-t border-white w-full my-4" />
            <div className="px-4">
              <CorrespondenceSearch />
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default DesktopMenu;
