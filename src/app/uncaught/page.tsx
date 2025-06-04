'use client';

import GlobalError from '../global-error';
import React, { useEffect } from 'react';

const UncaughtPage = () => {
  useEffect(() => {
    throw new Error('Test error from ErrorTestPage');
  }, []);
  return <GlobalError error={new Error('WONTONS')} />;
};

export default UncaughtPage;
