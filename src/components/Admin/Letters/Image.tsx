'use client';

import NextImage from 'next/image';
import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

const Image = ({
  alt,
  className,
  fallbackSrc = '/missing.jpg',
  fill,
  sizes,
  src,
}: Props) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <NextImage
      alt={alt}
      className={className}
      fill={fill}
      onError={() => setImgSrc(fallbackSrc)}
      sizes={sizes}
      src={imgSrc || fallbackSrc}
    />
  );
};

export default Image;
