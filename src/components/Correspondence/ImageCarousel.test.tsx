import { render, screen, fireEvent } from '@testing-library/react';
import ImageCarousel from './ImageCarousel';
import { Letter, LetterImage } from '@ts-types/letter';

// jest.mock('next/image', () => ({
//   __esModule: true,
//   default: (props: any) => {
//     const { src, alt, ...rest } = props;
//     return <img src={src} alt={alt} {...rest} />;
//   },
// }));

describe('ImageCarousel', () => {
  const mockImages = [
    { id: '1', urlThumbnail: '/thumb1.jpg' },
    { id: '2', urlThumbnail: '/thumb2.jpg' },
    { id: '3', urlThumbnail: '/thumb3.jpg' },
  ] as LetterImage[];

  const mockLetter = {
    imageURLs: mockImages,
  } as unknown as Letter;

  const handleClick = jest.fn();

  beforeEach(() => {
    handleClick.mockClear();
  });

  it('renders all images', () => {
    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={1} />,
    );

    mockImages.forEach((_, idx) => {
      expect(screen.getByAltText(`Thumbnail ${idx}`)).toBeInTheDocument();
    });
  });

  it('calls onClick with correct index and image on button click', () => {
    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={0} />,
    );

    const secondButton = screen.getByAltText('Thumbnail 1').closest('button');
    fireEvent.click(secondButton!);

    expect(handleClick).toHaveBeenCalledWith(1, mockImages[1]);
  });

  it('applies selected styles correctly', () => {
    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={2} />,
    );

    const thirdImage = screen.getByAltText('Thumbnail 2');
    const ringDiv = thirdImage.closest('div')?.querySelector('.ring-2');

    expect(ringDiv).toBeInTheDocument();
  });

  it('uses fallback image if urlThumbnail is missing', () => {
    const fallbackLetter = {
      imageURLs: [{ id: '1', urlThumbnail: '' }],
    } as unknown as Letter;

    render(
      <ImageCarousel
        letter={fallbackLetter}
        onClick={handleClick}
        selected={0}
      />,
    );

    const img = screen.getByAltText('Thumbnail 0');
    expect(img).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fmissing.jpg&w=3840&q=75',
    );
  });
});
