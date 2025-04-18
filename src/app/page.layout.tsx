import { Header } from '@components/Header';
import { Footer } from '@components/Footer';

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 bg-gray-100 flex">{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
