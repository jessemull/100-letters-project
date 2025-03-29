import { Header, Footer } from '../components';

const HomePageLayout = ({ children }: { children: React.ReactNode }) => (
  <div
    className="flex flex-col"
    style={{ minHeight: 'calc(100vh - 56px - 32px)' }}
  >
    <Header />
    <main className="flex-1 bg-gray-100">{children}</main>
    <Footer />
  </div>
);

export default HomePageLayout;
