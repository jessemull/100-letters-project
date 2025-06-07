'use client';

import React from 'react';

interface Props {
  className?: string;
}

const Skeleton: React.FC<Props> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white/20 rounded animate-pulse backdrop-blur-md ${className}`}
    />
  );
};

export default Skeleton;
