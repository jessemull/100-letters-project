'use client';

import NextImage from 'next/image';
import React, { useState } from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  height?: number | `${number}` | undefined;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  loading?: string;
  sizes?: string;
  width?: number | `${number}` | undefined;
}

const Image = ({
  alt,
  className,
  fallbackSrc = '/missing.jpg',
  fill,
  height,
  priority,
  sizes,
  src,
  width,
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <NextImage
      alt={alt}
      className={className}
      fill={fill}
      height={height}
      onError={() => setImgSrc(fallbackSrc)}
      sizes={sizes}
      priority={priority}
      src={imgSrc || fallbackSrc}
      width={width}
    />
  );
};

export default Image;
