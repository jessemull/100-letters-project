'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Progress } from '@components/Form';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { RecipientForm } from '@components/Admin';

const RecipientPage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<Progress size={16} color="white" />}>
        <RecipientForm />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default RecipientPage;
