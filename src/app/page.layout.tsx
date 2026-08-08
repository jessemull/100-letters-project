'use client';

import { DesktopMenu } from '@components/Menu';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { SearchProvider } from '@contexts/SearchProvider';
import { Toaster } from 'react-hot-toast';
import { useDesktopMenu } from '@contexts/DesktopMenuProvider';
import { useMemo } from 'react';

/**
 * Locked viewport chrome (not CSS sticky):
 * Header and footer frame the middle band. Only main scrolls.
 * Sidebar lives in that middle band so it ends above the full-width footer.
 */
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { collapsed, setCollapsed } = useDesktopMenu();

  const sidebarWidth = useMemo(
    () => (collapsed ? 'w-12' : 'w-80'),
    [collapsed],
  );

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/background.webp')",
        }}
      />
      <Header />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={`relative z-0 hidden min-h-0 shrink-0 overflow-hidden lg:flex lg:flex-col ${sidebarWidth} text-white transition-[width] duration-300 ease-in-out`}
          data-testid="menu-width"
        >
          <SearchProvider>
            <DesktopMenu collapsed={collapsed} setCollapsed={setCollapsed} />
          </SearchProvider>
        </aside>
        <main className="relative z-0 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="pr-2 pl-2 pt-3 pb-3 md:p-0 md:px-8">{children}</div>
        </main>
      </div>
      <div className="relative z-50 shrink-0">
        <Footer />
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default PageLayout;
