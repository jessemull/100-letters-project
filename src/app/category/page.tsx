import PageLayout from '../page.layout';
import { Category } from '@components/Category';
import { SearchProvider } from '@contexts/SearchProvider';

const CategoryPage = () => (
  <PageLayout>
    <SearchProvider>
      <Category />
    </SearchProvider>
  </PageLayout>
);

export default CategoryPage;
