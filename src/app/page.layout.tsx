'use client';

import { useMemo } from 'react';
import { useDesktopMenu } from '@contexts/DesktopMenuProvider';
import { DesktopMenu } from '@components/Menu';
import { SearchProvider } from '@contexts/SearchProvider';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import { Toaster } from 'react-hot-toast';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { collapsed, setCollapsed } = useDesktopMenu();

  const sidebarWidth = useMemo(
    () => (collapsed ? 'w-16' : 'w-80'),
    [collapsed],
  );

  return (
    <div className="flex flex-col">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/signin.webp')",
          backgroundAttachment: 'fixed',
        }}
      />
      <Header />
      <div className="flex w-full">
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
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default PageLayout;
