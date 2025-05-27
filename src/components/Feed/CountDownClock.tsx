'use client';

import React, { useEffect, useState } from 'react';
import { CountDown } from '@ts-types/feed';
import { calculateCountdown } from '@util/feed';

interface Props {
  earliestSentAtDate: string;
}

const CountDownClock: React.FC<Props> = ({ earliestSentAtDate }) => {
  const [countdown, setCountdown] = useState<null | CountDown>(null);
  useEffect(() => {
    if (!earliestSentAtDate) return;

    const targetDate = new Date(earliestSentAtDate);
    targetDate.setFullYear(targetDate.getFullYear() + 1);

    const interval = setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [earliestSentAtDate]);

  return countdown ? (
    <p className="text-lg">
      Countdown to the Letter-o-calypse:{' '}
      <span className="font-semibold">
        {countdown.days}d {countdown.hours}h {countdown.minutes}m{' '}
        {countdown.seconds}s
      </span>
    </p>
  ) : (
    <p>Countdown clock kicking off soon...</p>
  );
};

export default CountDownClock;
