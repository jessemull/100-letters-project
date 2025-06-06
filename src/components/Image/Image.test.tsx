import React from 'react';
import { Image } from '@components/Image';
import { ImageProps } from './Image';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Image Component', () => {
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

  it('Renders with correct props.', () => {
    render(getImage());
    const img = screen.getByAltText('Test image') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.alt).toBe('Test image');
    expect(img.src).toContain('test.jpg');
    expect(img.className).toContain('rounded');
  });

  it('Uses default fallbackSrc if none provided.', () => {
    render(getImage({ src: undefined }));
    const img = screen.getByAltText('Test image') as HTMLImageElement;

    fireEvent.error(img);

    const updatedImg = screen.getByAltText('Test image') as HTMLImageElement;
    expect(updatedImg.src).toContain('alt-image.jpg');
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(getImage());

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
