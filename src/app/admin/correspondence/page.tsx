'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { CorrespondenceForm } from '@components/Admin';
import { Progress } from '@components/Form';
import { ProtectedRoute } from '@components/ProtectedRoute';

const CorrespondencePage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<Progress size={16} color="white" />}>
        <CorrespondenceForm />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default CorrespondencePage;
