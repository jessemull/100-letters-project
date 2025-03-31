import React from 'react';

const Progress: React.FC = () => (
  <div data-testid="progress" className="w-6 h-6">
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default Progress;
