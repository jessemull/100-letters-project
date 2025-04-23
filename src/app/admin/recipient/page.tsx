'use client';

import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Progress } from '@components/Form';
import { RecipientForm } from '@components/Admin';

const RecipientPage = () => (
  <PageLayout>
    <Suspense fallback={<Progress size={16} color="white" />}>
      <RecipientForm />
    </Suspense>
  </PageLayout>
);

export default RecipientPage;
