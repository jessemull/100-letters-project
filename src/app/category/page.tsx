import PageLayout from '@pages/page.layout';
import { Category } from '@components/Category';
import { Suspense } from 'react';
import { SuspenseProgress } from '@components/Form';

const CategoryPage = () => (
  <PageLayout>
    <Suspense fallback={<SuspenseProgress />}>
      <Category />
    </Suspense>
  </PageLayout>
);

export default CategoryPage;
