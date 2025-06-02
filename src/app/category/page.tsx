import PageLayout from '../page.layout';
import { Category } from '@components/Category';
import { SearchProvider } from '@contexts/SearchProvider';
import { Suspense } from 'react';
import { SuspenseProgress } from '@components/Form';

const CategoryPage = () => (
  <PageLayout>
    <SearchProvider>
      <Suspense fallback={<SuspenseProgress />}>
        <Category />
      </Suspense>
    </SearchProvider>
  </PageLayout>
);

export default CategoryPage;
