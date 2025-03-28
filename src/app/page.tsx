import { Header, Feed, Footer } from '../components';

const HomePage = () => (
  <div className="min-h-screen h-[calc(100vh-32px)] overflow-auto">
    <Header />
    <Feed />
    <Footer />
  </div>
);

export default HomePage;
