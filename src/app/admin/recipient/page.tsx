'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { ProtectedRoute } from '@components/Protected';
import { RecipientForm } from '@components/Admin';
import { SuspenseProgress } from '@components/Form';

const RecipientPage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<SuspenseProgress />}>
        <RecipientForm />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default RecipientPage;
