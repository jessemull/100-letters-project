'use client';

import React, { useEffect, useState } from 'react';
import { clockLabels } from '@constants/feed';

const ClockSkeleton = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 438) {
        setScale(1);
      } else {
        const minScale = 0.6;
        const newScale = Math.max(minScale, width / 438);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="w-full max-w-3xl mx-auto px-4 animate-pulse select-none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <p className="text-center mb-4 text-lg font-semibold text-white font-merriweather">
        Ink Runs Dry In
      </p>
      <div className="flex justify-center gap-x-6 text-center">
        {clockLabels.map((label, idx) => (
          <div key={label} className="flex flex-col items-center gap-y-2">
            <div className="flex gap-x-1">
              {[...Array(idx === 0 ? 3 : 2)].map((_, i) => (
                <div
                  key={`${label}-${i}`}
                  className="w-8 h-12 rounded bg-white/10 border border-white/15 flex items-center justify-center font-merriweather font-semibold text-2xl leading-[48px] text-white"
                >
                  <span className="opacity-0">8</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-white uppercase tracking-wide font-merriweather">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClockSkeleton;
