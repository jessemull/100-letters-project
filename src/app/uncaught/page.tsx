'use client';

import React, { useEffect } from 'react';

const UncaughtPage = () => {
  useEffect(() => {
    throw new Error('Testing uncaught error!');
  }, []);
  return <div>Error Test</div>;
};

export default UncaughtPage;
