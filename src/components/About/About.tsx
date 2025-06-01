'use client';

import React from 'react';
import { ComingSoon } from '@components/ComingSoon';
import { Envelope } from '@components/Animation';
import { useResizeDetector } from 'react-resize-detector';

const About = () => {
  const { width, ref } = useResizeDetector();
  return (
    <div ref={ref} className="p-8 md:py-16">
      <div className="relative flex flex-col flex-1 items-center justify-center space-y-8 z-10 min-h-[500px]">
        <Envelope width={width} />
        <ComingSoon />
      </div>
    </div>
  );
};

export default About;
