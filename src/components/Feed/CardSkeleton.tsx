'use client';

import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden shadow-lg bg-white/10">
      <div className="w-full h-48 bg-white/20" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-white/30 rounded w-full" />
        <div className="h-3 bg-white/20 rounded w-1/2" />
        <div className="h-3 bg-white/20 rounded w-1/2" />
      </div>
    </div>
  );
};

export default CardSkeleton;
