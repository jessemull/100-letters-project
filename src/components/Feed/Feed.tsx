'use client';

import React, { MutableRefObject, useRef } from 'react';
import { ComingSoon } from '@components/ComingSoon';
import { Envelope } from '@components/Animation';

const Feed = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={containerRef}
      className="bg-gray-100 flex flex-col items-center p-16 md:p-32"
    >
      <div className="relative flex flex-col items-center justify-center space-y-8 z-10 min-h-[500px]">
        <Envelope
          containerRef={containerRef as MutableRefObject<HTMLElement>}
        />
        <ComingSoon />
      </div>
    </div>
  );
};

export default Feed;
