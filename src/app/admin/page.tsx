'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Admin } from '@components/Admin';
import { Progress } from '@components/Form';
import { ProtectedRoute } from '@components/ProtectedRoute';

const AdminPage = () => (
  <PageLayout>
    <ProtectedRoute>
      <Suspense fallback={<Progress size={16} color="white" />}>
        <Admin />
      </Suspense>
    </ProtectedRoute>
  </PageLayout>
);

export default AdminPage;
