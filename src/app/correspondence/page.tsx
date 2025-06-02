'use client';

import PageLayout from '../page.layout';
import React, { Suspense } from 'react';
import { CorrespondenceNavigator } from '@components/Correspondence';
import { SuspenseProgress } from '@components/Form';

const CorrespondencePage = () => (
  <PageLayout>
    <Suspense fallback={<SuspenseProgress />}>
      <CorrespondenceNavigator />
    </Suspense>
  </PageLayout>
);

export default CorrespondencePage;
