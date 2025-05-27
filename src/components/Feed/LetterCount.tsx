'use client';

import React from 'react';

interface Props {
  count?: number | string;
}

const LetterCount: React.FC<Props> = ({ count = 0 }) => {
  return <p className="text-lg">{count} Letters Written</p>;
};

export default LetterCount;
