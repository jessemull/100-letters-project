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
    () => (collapsed ? 'w-16' : 'w-80'),
    [collapsed],
  );

  return (
    <div className="flex flex-col min-h-screen relative">
      <div
        className="min-h-screen fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/background.webp')",
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main
          role="main"
          className={`
            flex flex-1 w-full
            flex-col lg:flex-row
            justify-center lg:justify-start
            items-center lg:items-stretch
            p-4 sm:p-6 lg:p-0 md:p-8
            sm:min-h-[calc(100vh-56px-56px-24px)]
            min-h-[calc(100vh-56px-56px-16px)]
          `}
        >
          <div
            className={`hidden lg:block ${sidebarWidth} text-white`}
            data-testid="menu-width"
          >
            <div className="flex flex-col h-screen sticky top-0">
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden"
                style={{ scrollbarGutter: 'stable' }}
              >
                <SearchProvider>
                  <DesktopMenu
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />
                </SearchProvider>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full px-0 lg:px-8">{children}</div>
        </main>
        <Footer />
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default PageLayout;
