'use client';

import LetterForm from '@components/Admin/Letters/LetterForm';
import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { ProtectedRoute } from '@components/Protected';
import { SuspenseProgress } from '@components/Form';

const LetterPage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<SuspenseProgress />}>
        <LetterForm />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default LetterPage;
