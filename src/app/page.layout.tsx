'use client';

import { DesktopMenu } from '@components/Menu';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { SearchProvider } from '@contexts/SearchProvider';
import { Toaster } from 'react-hot-toast';
import { useDesktopMenu } from '@contexts/DesktopMenuProvider';
import { useMemo } from 'react';

/**
 * Header stays put. Sidebar is fixed under the header to the viewport
 * bottom and paints over the footer. Main content is offset for the
 * sidebar width; the footer stays full-bleed underneath.
 */
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { collapsed, setCollapsed } = useDesktopMenu();

  const sidebarWidth = useMemo(
    () => (collapsed ? 'w-12' : 'w-80'),
    [collapsed],
  );
  const contentOffset = useMemo(
    () => (collapsed ? 'lg:pl-12' : 'lg:pl-80'),
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
      <aside
        className={`fixed top-[56px] bottom-0 left-0 z-40 hidden overflow-hidden lg:block ${sidebarWidth} text-white transition-[width] duration-300 ease-in-out`}
        data-testid="menu-width"
      >
        <SearchProvider>
          <DesktopMenu collapsed={collapsed} setCollapsed={setCollapsed} />
        </SearchProvider>
      </aside>
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex min-h-full flex-col justify-between">
          <div
            className={`pr-2 pl-2 pt-3 pb-3 md:p-0 md:px-8 transition-[padding] duration-300 ease-in-out ${contentOffset}`}
          >
            {children}
          </div>
          <Footer />
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

export default PageLayout;
