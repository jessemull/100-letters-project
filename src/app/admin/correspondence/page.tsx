'use client';

import { CorrespondenceForm } from '@components/Admin';
import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Progress } from '@components/Form';

const CorrespondencePage = () => (
  <PageLayout>
    <Suspense fallback={<Progress size={16} color="white" />}>
      <CorrespondenceForm />
    </Suspense>
  </PageLayout>
);

export default CorrespondencePage;
