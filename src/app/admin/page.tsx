'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ProtectedRoute } from '@components/Protected';
import { SuspenseProgress } from '@components/Form';

const Admin = dynamic(() => import('@components/Admin/Admin'), {
  ssr: false,
  loading: () => <SuspenseProgress />,
});

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
