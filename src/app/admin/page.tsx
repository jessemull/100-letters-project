'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Admin } from '@components/Admin';
import { Progress } from '@components/Form';

const AdminPage = () => (
  <PageLayout>
    <Suspense fallback={<Progress size={16} color="white" />}>
      <Admin />
    </Suspense>
  </PageLayout>
);

export default AdminPage;
