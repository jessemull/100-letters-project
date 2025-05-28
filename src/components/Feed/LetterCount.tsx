'use client';

import React from 'react';

interface Props {
  count?: number | string;
}

const LetterCount: React.FC<Props> = ({ count = 0 }) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-white text-2xl font-bold shadow-sm">
        {count}
      </div>
      <p className="text-lg tracking-wide text-white pt-2">Letters Written</p>
    </div>
  );
};

export default LetterCount;
