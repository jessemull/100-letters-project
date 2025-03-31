import { Header, Footer } from '../components';

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col" style={{ minHeight: '100vh' }}>
    <Header />
    <main
      className="flex-1 bg-gray-100"
      style={{ height: 'calc(100vh - 56px - 36px)' }}
    >
      {children}
    </main>
    <Footer />
  </div>
);

export default PageLayout;
