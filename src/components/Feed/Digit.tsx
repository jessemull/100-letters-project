'use client';

import React from 'react';

interface Props {
  digit: string;
}

const Digit: React.FC<Props> = ({ digit }) => {
  const offset = parseInt(digit, 10);

  return (
    <span
      className="inline-block w-6 sm:w-8 rounded bg-white/10 border border-white/15 text-white font-merriweather font-semibold text-xl sm:text-2xl overflow-hidden"
      style={
        {
          // This defines the height of *each number row*
          // and sets the height of the container accordingly
          '--digit-height': '40px',
          '--digit-height-sm': '48px',
          height: 'var(--digit-height)',
        } as React.CSSProperties
      }
    >
      <span
        className="transition-transform duration-300 ease-in-out block will-change-transform"
        style={{
          transform: `translateY(calc(-1 * ${offset} * var(--digit-height)))`,
        }}
      >
        {[...Array(10).keys()].map((n) => (
          <div
            key={n}
            className="text-center flex items-center justify-center"
            style={{
              height: 'var(--digit-height)',
            }}
          >
            {n}
          </div>
        ))}
      </span>

      <style jsx>{`
        @media (min-width: 640px) {
          span {
            height: var(--digit-height-sm) !important;
          }

          span > span > div {
            height: var(--digit-height-sm) !important;
          }

          span > span {
            transform: translateY(
              calc(-1 * ${offset} * var(--digit-height-sm))
            ) !important;
          }
        }
      `}</style>
    </span>
  );
};

export default Digit;
