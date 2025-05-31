'use client';

import React from 'react';

interface Props {
  digit: string;
}

const Digit: React.FC<Props> = ({ digit }) => (
  <span className="inline-block w-8 h-12 rounded bg-white/10 border border-white/15 text-white font-merriweather font-semibold text-2xl overflow-hidden leading-[48px]">
    <span
      className="transition-transform duration-300 ease-in-out block"
      style={{
        transform: `translateY(calc(-${digit} * 3rem))`,
      }}
    >
      {[...Array(10).keys()].map((n) => (
        <div
          key={n}
          className="h-12 leading-12 text-center"
          style={{ lineHeight: '3rem' }}
        >
          {n}
        </div>
      ))}
    </span>
  </span>
);

export default Digit;
