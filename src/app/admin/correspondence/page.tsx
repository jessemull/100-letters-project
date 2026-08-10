'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { CorrespondenceForm } from '@components/Admin';
import { ProtectedRoute } from '@components/Protected';
import { SuspenseProgress } from '@components/Form';

const CorrespondencePage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<SuspenseProgress />}>
        <CorrespondenceForm />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default CorrespondencePage;
