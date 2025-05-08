// src/components/__tests__/Image.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Image } from '@components/Admin/Letters';
import NextImage from 'next/image';
import { ImageProps } from './Image';

describe('Image component', () => {
  const getImage = (props?: Partial<ImageProps>) => (
    <Image
      src="/test.jpg"
      alt="Test image"
      className="rounded"
      sizes="100vw"
      fill
      {...props}
    />
  );

  it('renders with correct props', () => {
    render(getImage());
    const img = screen.getByAltText('Test image') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.alt).toBe('Test image');
    expect(img.src).toContain('test.jpg');
    expect(img.className).toContain('rounded');
  });

  it('uses default fallbackSrc if none provided', () => {
    render(getImage({ src: undefined }));
    const img = screen.getByAltText('Test image') as HTMLImageElement;

    fireEvent.error(img);

    const updatedImg = screen.getByAltText('Test image') as HTMLImageElement;
    expect(updatedImg.src).toContain('missing.jpg');
  });
});
