'use client';

import React, { useEffect, useState } from 'react';
import { Digit } from '@components/Feed';
import { formatTime } from '@util/clock';

interface Props {
  earliestSentAtDate?: string;
}

const Clock: React.FC<Props> = ({ earliestSentAtDate }) => {
  const [scale, setScale] = useState(1);
  const [timeLeft, setTimeLeft] = useState(() => {
    const base = earliestSentAtDate ? new Date(earliestSentAtDate) : new Date();
    const deadline = new Date(base.getTime() + 365 * 24 * 60 * 60 * 1000);
    return deadline.getTime() - Date.now();
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width >= 438) {
        setScale(1);
      } else {
        const minScale = 0.6;
        const newScale = Math.max(minScale, width / 438);
        setScale(newScale);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { days, hours, minutes, seconds } = formatTime(timeLeft);
  const labels = ['DAYS', 'HRS', 'MIN', 'SEC'];
  const values = [days, hours, minutes, seconds];

  return (
    <div
      className="w-full max-w-3xl mx-auto px-4"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <p className="text-center mb-4 text-lg font-semibold text-white font-merriweather select-none">
        Ink Runs Dry In
      </p>
      <div className="flex justify-center gap-x-6 text-center select-none">
        {values.map((value, i) => (
          <div key={labels[i]} className="flex flex-col items-center gap-y-2">
            <div className="flex gap-x-1">
              {[...value].map((digit, j) => (
                <Digit key={`${labels[i]}-${j}`} digit={digit} />
              ))}
            </div>
            <div className="text-xs text-white uppercase tracking-wide font-merriweather">
              {labels[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;
