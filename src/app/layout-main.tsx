import { Header, Footer } from '../components';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 bg-gray-100">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
