import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import { Toaster } from 'react-hot-toast';

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen relative">
    <div
      className="min-h-screen fixed inset-0 z-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/signin.webp')",
        backgroundAttachment: 'fixed',
      }}
    />
    <div className="relative z-10 flex flex-col min-h-screen">
      <Header />
      <main
        className={`
          flex-1 overflow-y-auto flex justify-center items-center
          p-4 sm:p-6 md:p-8
          min-h-[calc(100vh-56px-56px-32px)]
          sm:min-h-[calc(100vh-56px-56px-24px)]
          min-h-[calc(100vh-56px-56px-16px)]
        `}
      >
        {children}
      </main>
      <Footer />
    </div>
    <Toaster position="top-center" />
  </div>
);

export default PageLayout;
