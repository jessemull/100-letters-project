'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CorrespondenceSearch,
  LetterSearch,
  MenuNavItems,
  RecipientSearch,
} from '@components/Menu';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@contexts/AuthProvider';

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const panelTransition = {
  duration: 0.3,
  ease: 'easeInOut' as const,
};

const DesktopMenu: React.FC<Props> = ({ collapsed, setCollapsed }) => {
  const { isLoggedIn, signOut } = useAuth();
  return (
    <div
      className={`
        hidden lg:flex flex-col text-white transition-all duration-300 ease-in-out
        h-full relative font-merriweather
      `}
    >
      <div className="absolute inset-0 z-[-1] bg-white/30 backdrop-blur-md" />
      <div className="flex items-center border-b border-white/40 py-3 px-2 min-h-[52px]">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="find-letters-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pl-2 text-sm font-bold whitespace-nowrap"
            >
              Find Letters
            </motion.span>
          )}
        </AnimatePresence>
        <button
          aria-label="Toggle Menu"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto mr-1 text-white cursor-pointer shrink-0"
          type="button"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
        <nav
          aria-label="Desktop Navigation"
          className="flex flex-col gap-4 text-sm"
        >
          <div
            className={`flex flex-col gap-3 pt-4 transition-all duration-300 ease-in-out ${
              collapsed ? 'px-2' : 'px-4'
            }`}
          >
            <MenuNavItems
              isLoggedIn={isLoggedIn}
              handleLogout={signOut}
              collapsed={collapsed}
              onNavigate={() => setCollapsed(true)}
            />
          </div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="desktop-search-panels"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={panelTransition}
                className="overflow-hidden"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </div>
  );
};

export default DesktopMenu;
