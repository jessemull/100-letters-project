'use client';

import React from 'react';
import { clockLabels } from '@constants/feed';

const ClockSkeleton = () => {
  return (
    <div className="w-full max-w-[438px] mx-auto px-4 animate-pulse select-none">
      <p className="text-center mb-4 text-lg font-semibold text-white font-merriweather">
        Ink Runs Dry In
      </p>
      <div className="flex justify-center gap-x-3 sm:gap-x-4 text-center flex-wrap">
        {clockLabels.map((label, idx) => (
          <div
            key={label}
            className="flex flex-col items-center gap-y-1 sm:gap-y-2"
          >
            <div className="flex gap-x-0.5 sm:gap-x-1">
              {[...Array(idx === 0 ? 3 : 2)].map((_, i) => (
                <div
                  key={`${label}-${i}`}
                  className="w-6 h-10 sm:w-8 sm:h-12 rounded bg-white/10 border border-white/15 flex items-center justify-center font-merriweather font-semibold text-xl sm:text-2xl leading-[40px] sm:leading-[48px] text-white"
                >
                  <span className="opacity-0">8</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] sm:text-xs text-white uppercase tracking-wide font-merriweather">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClockSkeleton;
