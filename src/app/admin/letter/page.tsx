'use client';

import LetterForm from '@components/Admin/Letters/LetterForm';
import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Progress } from '@components/Form';
import { ProtectedRoute } from '@components/ProtectedRoute';

const LetterPage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<Progress size={16} color="white" />}>
        <LetterForm />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default LetterPage;
