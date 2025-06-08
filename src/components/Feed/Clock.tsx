'use client';

import bootstrap from '@public/data/bootstrap.json';
import { Digit } from '@components/Feed';
import { clockLabels } from '@constants/feed';
import { formatTime } from '@util/clock';
import { useEffect, useMemo, useState } from 'react';

const MS_IN_YEAR = 365 * 24 * 60 * 60 * 1000;

const baseDate = new Date(bootstrap.earliestSentAtDate);
const deadline = new Date(baseDate.getTime() + MS_IN_YEAR);

const Clock = () => {
  const [timeLeft, setTimeLeft] = useState(
    () => deadline.getTime() - Date.now(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, deadline.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { days, hours, minutes, seconds } = useMemo(
    () => formatTime(timeLeft),
    [timeLeft],
  );

  return (
    <div className="w-full max-w-[438px] mx-auto px-4">
      <p className="text-center mb-4 text-lg font-semibold text-white font-merriweather select-none">
        Ink Runs Dry In
      </p>
      <div className="flex justify-center gap-x-3 sm:gap-x-4 text-center select-none flex-wrap">
        {[days, hours, minutes, seconds].map((value, i) => (
          <div
            key={clockLabels[i]}
            className="flex flex-col items-center gap-y-1 sm:gap-y-2"
          >
            <div className="flex gap-x-0.5 sm:gap-x-1">
              {[...value].map((digit, j) => (
                <Digit key={`${clockLabels[i]}-${j}`} digit={digit} />
              ))}
            </div>
            <div className="text-[10px] sm:text-xs text-white uppercase tracking-wide font-merriweather">
              {clockLabels[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;
