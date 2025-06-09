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
        h-full relative
        font-merriweather
      `}
    >
      <div className="absolute inset-0 z-[-1] bg-white/30 backdrop-blur-md" />
      <div
        className="flex flex-col overflow-y-auto overflow-x-hidden pb-4"
        style={{ minHeight: 'calc(100vh - 56px)' }}
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
          className="flex flex-col gap-4 text-sm"
        >
          <div className="flex flex-col gap-4 text-sm px-4 pt-4">
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
