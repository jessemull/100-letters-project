import React from 'react';
import Progress from './Progress';

const SuspenseProgress = () => (
  <div className="w-full h-full min-h-screen flex items-center justify-center">
    <Progress size={16} color="white" />
  </div>
);

export default SuspenseProgress;
