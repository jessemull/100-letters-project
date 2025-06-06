'use client';

import React from 'react';
import bootstrap from '@public/data/bootstrap.json';
import { clockCircumference, clockRadius } from '@constants/feed';

const { totalCorrespondences: letterCount } = bootstrap;
const progress = letterCount / 100;
const strokeDashoffset = clockCircumference * (1 - progress);

const Completion = () => (
  <div className="flex flex-col items-center text-white">
    <p className="text-lg font-semibold">Letters Written</p>
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r={clockRadius}
        stroke="#444"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r={clockRadius}
        stroke="#4ade80"
        strokeWidth="8"
        fill="none"
        strokeDasharray={clockCircumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="53"
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

export default Completion;
