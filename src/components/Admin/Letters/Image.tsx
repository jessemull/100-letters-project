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
  fallbackSrc = '/images/alt-image.jpg',
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
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDcyMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0iYiI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIiIC8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjcyMCIgaGVpZ2h0PSI0MDAiIGZpbHRlcj0idXJsKCNiKSIgZmlsbD0idXJsKCNnKSIgLz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjY2NjY2NjIiBzdG9wLW9wYWNpdHk9IjAuMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9zdmc+"
      src={imgSrc || fallbackSrc}
      width={width}
    />
  );
};

export default Image;
