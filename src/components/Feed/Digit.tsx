'use client';

import React, { useEffect, useState } from 'react';

interface Props {
  digit: string;
}

const Digit: React.FC<Props> = ({ digit }) => {
  const [digitHeight, setDigitHeight] = useState(40);

  const offset = parseInt(digit, 10);

  useEffect(() => {
    const smQuery = window.matchMedia('(min-width: 640px)');

    const updateHeight = () => {
      setDigitHeight(smQuery.matches ? 48 : 40);
    };

    updateHeight();

    smQuery.addEventListener('change', updateHeight);
    return () => {
      smQuery.removeEventListener('change', updateHeight);
    };
  }, []);

  return (
    <span
      className="inline-block w-6 sm:w-8 overflow-hidden rounded border border-white/15 bg-white/10 text-white text-xl sm:text-2xl font-merriweather font-semibold"
      style={{ height: `${digitHeight}px` }}
    >
      <span
        className="block transition-transform duration-300 ease-in-out will-change-transform"
        style={{
          transform: `translateY(-${offset * digitHeight}px)`,
        }}
      >
        {[...Array(10).keys()].map((n) => (
          <div
            key={n}
            className="flex items-center justify-center text-center"
            style={{ height: `${digitHeight}px` }}
          >
            {n}
          </div>
        ))}
      </span>
    </span>
  );
};

export default Digit;
