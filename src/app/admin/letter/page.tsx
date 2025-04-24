'use client';

import LetterForm from '@components/Admin/Letters/LetterForm';
import PageLayout from '@pages/page.layout';
import React, { Suspense } from 'react';
import { Progress } from '@components/Form';

const LetterPage = () => (
  <PageLayout>
    <Suspense fallback={<Progress size={16} color="white" />}>
      <LetterForm />
    </Suspense>
  </PageLayout>
);

export default LetterPage;
