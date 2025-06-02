'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Admin } from '@components/Admin';
import { ProtectedRoute } from '@components/Protected';
import { SuspenseProgress } from '@components/Form';

const AdminPage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<SuspenseProgress />}>
        <Admin />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default AdminPage;
