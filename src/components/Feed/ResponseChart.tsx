'use client';

import React from 'react';

interface Props {
  responseCompletion: number; // expects 0 to 1, still used for the ring progress
  letterCount: number; // total letters written so far
  goalCount?: number; // optional, default 100 (not shown)
}

const ResponseChart: React.FC<Props> = ({
  responseCompletion,
  letterCount,
  goalCount = 100,
}) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(responseCompletion, 0), 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center text-white">
      {/* Label on top */}
      <p className="text-lg font-semibold">Letters Written</p>

      <svg width={100} height={100} viewBox="0 0 100 100">
        {/* Background ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#444"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#4ade80"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          transform="rotate(-90 50 50)"
        />
        {/* Letter count centered */}
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

export default ResponseChart;
