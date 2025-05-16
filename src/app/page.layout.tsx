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
    <div className="relative flex min-h-screen flex-col">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/signin.webp')",
          backgroundAttachment: 'fixed',
        }}
      />
      <Header />
      <div className="flex flex-1 min-h-0">
        <div
          className={`hidden lg:block ${sidebarWidth} transition-all duration-300`}
          data-testid="menu-width"
        >
          <SearchProvider>
            <DesktopMenu collapsed={collapsed} setCollapsed={setCollapsed} />
          </SearchProvider>
        </div>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 sm:p-6 md:p-8 flex justify-center items-start overflow-y-auto pb-[56px]">
            {children}
          </main>
        </div>
      </div>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default PageLayout;
