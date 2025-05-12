import PageLayout from './page.layout';
import { Feed, categories } from '@components/Feed';

const HomePage = () => (
  <PageLayout>
    <Feed categories={categories} />
  </PageLayout>
);

export default HomePage;
