'use client';

import PageLayout from '../page.layout';
import React from 'react';
import { CorrespondenceNavigatorHOC } from '@components/Correspondence';

const CorrespondencePage = () => (
  <PageLayout>
    <CorrespondenceNavigatorHOC />
  </PageLayout>
);

export default CorrespondencePage;
