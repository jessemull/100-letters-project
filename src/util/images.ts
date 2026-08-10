import { LetterImage } from '@ts-types/letter';

/**
 * Prefer thumbnail / medium assets for feed cards so LCP is not a full _large CDN file.
 */
export const getCardImageUrl = (
  image?: Pick<LetterImage, 'url' | 'urlThumbnail'> | null,
): string => {
  if (image?.urlThumbnail) {
    return image.urlThumbnail;
  }

  const url = image?.url;
  if (!url) {
    return '/alt-image.jpg';
  }

  // Image processor emits _large / _large_N; cards should request the lighter sibling when present.
  return url.replace(/_large(_\d+)?(\.[^.]+)(?:\?.*)?$/i, '_medium$1$2');
};
