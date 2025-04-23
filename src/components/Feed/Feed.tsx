'use client';

import React from 'react';
import { ComingSoon } from '@components/ComingSoon';
import { Envelope } from '@components/Animation';
import { useResizeDetector } from 'react-resize-detector';

const Feed = () => {
  const { width, ref } = useResizeDetector();
  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative flex flex-col items-center justify-center space-y-8 z-10 min-h-[500px]">
        <Envelope width={width} />
        <ComingSoon />
      </div>
    </div>
  );
};

export default Feed;
