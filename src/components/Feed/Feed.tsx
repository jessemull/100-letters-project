'use client';

import React, { useEffect, useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { ComingSoon } from '@components/ComingSoon';
import { Envelope } from '@components/Animation';

const Feed = () => {
  const { width, ref } = useResizeDetector();
  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative flex flex-col items-center justify-center space-y-8 z-10 min-h-[500px]">
        {width && <Envelope containerWidth={width} />}
        <ComingSoon />
      </div>
    </div>
  );
};

export default Feed;
