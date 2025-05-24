'use client';

import PageLayout from '../page.layout';
import React, { Suspense } from 'react';
import { CorrespondenceNavigator } from '@components/Correspondence';
import { Progress } from '@components/Form';

const CorrespondencePage = () => (
  <PageLayout>
    <Suspense fallback={<Progress size={16} color="white" />}>
      <CorrespondenceNavigator />
    </Suspense>
  </PageLayout>
);

export default CorrespondencePage;
