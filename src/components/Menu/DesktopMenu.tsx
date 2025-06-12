'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CorrespondenceSearch,
  LetterSearch,
  MenuNavItems,
  RecipientSearch,
} from '@components/Menu';
import { useAuth } from '@contexts/AuthProvider';

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const DesktopMenu: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const { isLoggedIn, signOut } = useAuth();

  return (
    <div
      className={`
        hidden lg:flex flex-col text-white transition-all duration-300
        h-full relative font-merriweather
      `}
    >
      {/* Background blur */}
      <div className="absolute inset-0 z-[-1] bg-white/30 backdrop-blur-md" />

      {/* Fixed Top Header */}
      <div
        className={`flex items-center border-b border-white/40 py-3 ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {!collapsed && (
          <span className="text-sm font-bold whitespace-nowrap">
            Find Letters
          </span>
        )}
        <button
          aria-label="Toggle Menu"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* Scrollable content below the header */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
        <nav
          aria-label="Desktop Navigation"
          className="flex flex-col gap-4 text-sm"
        >
          <div
            className={`${collapsed ? 'px-2 pt-4' : 'px-4 pt-4'} flex flex-col gap-3`}
          >
            <MenuNavItems
              isLoggedIn={isLoggedIn}
              handleLogout={signOut}
              collapsed={collapsed}
              onNavigate={() => setCollapsed(true)}
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col mt-4">
              <div className="px-4">
                <RecipientSearch onClick={() => setCollapsed(true)} />
              </div>
              <hr className="border-t border-white w-full my-4" />
              <div className="px-4">
                <LetterSearch onClick={() => setCollapsed(true)} />
              </div>
              <hr className="border-t border-white w-full my-4" />
              <div className="px-4">
                <CorrespondenceSearch onClick={() => setCollapsed(true)} />
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default DesktopMenu;
