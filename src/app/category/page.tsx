import PageLayout from '../page.layout';
import { Category } from '@components/Category';
import { Progress } from '@components/Form';
import { SearchProvider } from '@contexts/SearchProvider';
import { Suspense } from 'react';

const CategoryPage = () => (
  <PageLayout>
    <SearchProvider>
      <Suspense fallback={<Progress size={16} color="white" />}>
        <Category />
      </Suspense>
    </SearchProvider>
  </PageLayout>
);

export default CategoryPage;
