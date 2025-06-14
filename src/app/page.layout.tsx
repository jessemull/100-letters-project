'use client';

import { DesktopMenu } from '@components/Menu';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { SearchProvider } from '@contexts/SearchProvider';
import { Toaster } from 'react-hot-toast';
import { useDesktopMenu } from '@contexts/DesktopMenuProvider';
import { useMemo } from 'react';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { collapsed, setCollapsed } = useDesktopMenu();

  const sidebarWidth = useMemo(
    () => (collapsed ? 'w-12' : 'w-80'),
    [collapsed],
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/background.webp')",
          backgroundAttachment: 'scroll',
        }}
      />
      <Header />
      <div className="flex flex-1 h-[calc(100vh-56px)] overflow-hidden">
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col min-h-[calc(100vh-56px)] justify-between">
            <div className="pr-2 pl-2 pt-3 pb-3 md:p-0 md:px-8 lg:pl-20">
              <div className="flex-1">{children}</div>
            </div>
            <Footer />
          </div>
        </main>
      </div>
      <aside
        className={`hidden lg:block ${sidebarWidth} text-white fixed top-[56px] bottom-0 left-0 z-40`}
        data-testid="menu-width"
      >
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <SearchProvider>
            <DesktopMenu collapsed={collapsed} setCollapsed={setCollapsed} />
          </SearchProvider>
        </div>
      </aside>
      <Toaster position="top-center" />
    </div>
  );
};

export default PageLayout;
