'use client';

import React from 'react';

interface Props {
  responseCompletion: number;
}

const ResponseChart: React.FC<Props> = ({ responseCompletion }) => {
  return (
    <p className="text-lg">
      Respond-o-meter:{' '}
      {(responseCompletion * 100).toFixed(1).replace(/\.0$/, '')}%
    </p>
  );
};

export default ResponseChart;
