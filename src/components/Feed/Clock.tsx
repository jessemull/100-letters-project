'use client';

import bootstrap from '@public/data/bootstrap.json';
import { Digit } from '@components/Feed';
import { clockLabels } from '@constants/feed';
import { formatTime } from '@util/clock';
import { useEffect, useMemo, useState } from 'react';

const CLOCK_WIDTH_PX = 438;
const MIN_SCALE = 0.6;
const MS_IN_YEAR = 365 * 24 * 60 * 60 * 1000;

const baseDate = new Date(bootstrap.earliestSentAtDate);
const deadline = new Date(baseDate.getTime() + MS_IN_YEAR);

const Clock = () => {
  const [scale, setScale] = useState(1);
  const [timeLeft, setTimeLeft] = useState(
    () => deadline.getTime() - Date.now(),
  );

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      setScale(
        width >= CLOCK_WIDTH_PX
          ? 1
          : Math.max(MIN_SCALE, width / CLOCK_WIDTH_PX),
      );
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

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
    <div
      className="w-full max-w-3xl mx-auto px-4"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      <p className="text-center mb-4 text-lg font-semibold text-white font-merriweather select-none">
        Ink Runs Dry In
      </p>
      <div className="flex justify-center gap-x-6 text-center select-none">
        {[days, hours, minutes, seconds].map((value, i) => (
          <div
            key={clockLabels[i]}
            className="flex flex-col items-center gap-y-2"
          >
            <div className="flex gap-x-1">
              {[...value].map((digit, j) => (
                <Digit key={`${clockLabels[i]}-${j}`} digit={digit} />
              ))}
            </div>
            <div className="text-xs text-white uppercase tracking-wide font-merriweather">
              {clockLabels[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;
