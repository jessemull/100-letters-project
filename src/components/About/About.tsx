'use client';

import React from 'react';
import { ComingSoon } from '@components/ComingSoon';
import { Envelope } from '@components/Animation';

const About = () => (
  <div className="flex justify-center p-8 md:p-16 lg:p-24">
    <div className="w-full max-w-6xl space-y-8">
      <h2 className="font-merriweather text-white text-2xl md:text-3xl font-semibold text-center">
        Coming Soon...
      </h2>
      <div className="flex flex-col items-center justify-center space-y-8">
        <Envelope />
        <div className="w-full max-w-5xl text-center">
          <ComingSoon />
        </div>
      </div>
    </div>
  </div>
);

export default About;
