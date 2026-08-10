'use client';

import NextImage from 'next/image';
import React, { useState } from 'react';

export interface ImageProps {
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fill?: boolean;
  height?: number | `${number}` | undefined;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  sizes?: string;
  src: string;
  width?: number | `${number}` | undefined;
}

const Image = ({
  alt,
  className,
  fallbackSrc = '/alt-image.jpg',
  fill,
  height,
  loading,
  priority,
  sizes,
  src,
  width,
}: ImageProps) => {
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const displaySrc = erroredSrc === src ? fallbackSrc : src;

  return (
    <NextImage
      alt={alt}
      className={className}
      fill={fill}
      height={height}
      loading={priority ? undefined : loading}
      onError={() => setErroredSrc(src)}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDcyMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0iYiI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIiIC8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjcyMCIgaGVpZ2h0PSI0MDAiIGZpbHRlcj0idXJsKCNiKSIgZmlsbD0idXJsKCNnKSIgLz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIHN0b3AtY29sb3I9IiNjY2NjY2MiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PC9saW5lYXJHcmFkaWVudD48L3N2Zz4="
      src={displaySrc || fallbackSrc}
      width={width}
    />
  );
};

export default Image;
