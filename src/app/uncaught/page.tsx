'use client';

import PageLayout from '../page.layout';
import React, { useEffect } from 'react';

const UncaughtPage = () => {
  useEffect(() => {
    throw new Error('Test error from ErrorTestPage');
  }, []);
  return (
    <PageLayout>
      <div>Uncaught Error Test Page</div>
    </PageLayout>
  );
};

export default UncaughtPage;
