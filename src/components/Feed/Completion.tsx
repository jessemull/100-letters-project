'use client';

import React, { useMemo } from 'react';

interface Props {
  letterCount: number;
  responseCompletion: number;
}

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Completion: React.FC<Props> = ({ responseCompletion, letterCount }) => {
  const progress = useMemo(
    () => Math.min(Math.max(responseCompletion, 0), 1),
    [responseCompletion],
  );
  const strokeDashoffset = useMemo(
    () => CIRCUMFERENCE * (1 - progress),
    [progress],
  );
  return (
    <div className="flex flex-col items-center text-white">
      <p className="text-lg font-semibold">Letters Written</p>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          stroke="#444"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          stroke="#4ade80"
          strokeWidth="8"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill="white"
          fontFamily="system-ui, sans-serif"
          dominantBaseline="middle"
        >
          {letterCount}
        </text>
      </svg>
    </div>
  );
};

export default Completion;
