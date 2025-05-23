'use client';

import PageLayout from '../page.layout';
import React from 'react';
import { CorrespondenceNavigatorHOC } from '@components/CorrespondenceNavigator';

const CorrespondencePage = () => (
  <PageLayout>
    <CorrespondenceNavigatorHOC />
  </PageLayout>
);

export default CorrespondencePage;
