import { getCardImageUrl } from './images';

describe('getCardImageUrl', () => {
  it('Prefers urlThumbnail when present.', () => {
    expect(
      getCardImageUrl({
        url: 'https://cdn.example/letter_large.jpg',
        urlThumbnail: 'https://cdn.example/letter_thumb.jpg',
      }),
    ).toBe('https://cdn.example/letter_thumb.jpg');
  });

  it('Maps _large CDN URLs to _medium for card grids.', () => {
    expect(
      getCardImageUrl({
        url: 'https://cdn.example/images/x/LETTER_FRONT/abc_large.jpg',
        urlThumbnail: '',
      }),
    ).toBe('https://cdn.example/images/x/LETTER_FRONT/abc_medium.jpg');

    expect(
      getCardImageUrl({
        url: 'https://cdn.example/mock_image_large_2.jpg',
        urlThumbnail: '',
      }),
    ).toBe('https://cdn.example/mock_image_medium_2.jpg');
  });

  it('Falls back to alt image when no URL is available.', () => {
    expect(getCardImageUrl(null)).toBe('/alt-image.jpg');
    expect(getCardImageUrl(undefined)).toBe('/alt-image.jpg');
    expect(getCardImageUrl({ url: '', urlThumbnail: '' })).toBe(
      '/alt-image.jpg',
    );
  });

  it('Leaves non-large URLs unchanged.', () => {
    expect(
      getCardImageUrl({
        url: '/alt-image.jpg',
        urlThumbnail: '',
      }),
    ).toBe('/alt-image.jpg');
  });
});
