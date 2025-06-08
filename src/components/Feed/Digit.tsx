'use client';

import React from 'react';

interface Props {
  digit: string;
}

const Digit: React.FC<Props> = ({ digit }) => {
  const offset = parseInt(digit, 10);

  return (
    <span
      className="digit-container"
      style={
        {
          '--digit-height': '40px',
          '--digit-height-sm': '48px',
          height: 'var(--digit-height)',
        } as React.CSSProperties
      }
    >
      <span
        className="digit-strip"
        style={{
          transform: `translateY(calc(-1 * ${offset} * var(--digit-height)))`,
        }}
      >
        {[...Array(10).keys()].map((n) => (
          <div key={n} className="digit-row">
            {n}
          </div>
        ))}
      </span>
    </span>
  );
};

export default Digit;
