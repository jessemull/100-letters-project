import PageLayout from './page.layout';
import { Feed } from '@components/Feed';
import { SearchProvider } from '@contexts/SearchProvider';

const HomePage = () => (
  <PageLayout>
    <SearchProvider>
      <Feed />
    </SearchProvider>
  </PageLayout>
);

export default HomePage;
