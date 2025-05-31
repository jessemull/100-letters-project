import ImageCarousel from './ImageCarousel';
import { Letter, LetterImage } from '@ts-types/letter';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';

const mockUseDrag = jest.fn().mockReturnValue({
  onMouseDown: jest.fn(),
  onMouseMove: jest.fn(),
  onMouseUpOrLeave: jest.fn(),
  shouldCancelClick: () => false,
});
jest.mock('@hooks/useDrag', () => ({
  useDrag: (...args: any[]) => mockUseDrag(...args),
}));

describe('ImageCarousel Component', () => {
  const mockImages = [
    { id: '1', urlThumbnail: '/thumb1.jpg' },
    { id: '2', urlThumbnail: '/thumb2.jpg' },
    { id: '3', urlThumbnail: '/thumb3.jpg' },
  ] as LetterImage[];

  const mockLetter = { imageURLs: mockImages } as unknown as Letter;
  let handleClick: jest.Mock;

  beforeEach(() => {
    handleClick = jest.fn();
    mockUseDrag.mockClear();
    mockUseDrag.mockReturnValue({
      onMouseDown: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseUpOrLeave: jest.fn(),
      shouldCancelClick: () => false,
    });
  });

  it('Renders all images.', () => {
    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={1} />,
    );
    mockImages.forEach((_, idx) => {
      expect(screen.getByAltText(`Thumbnail ${idx}`)).toBeInTheDocument();
    });
  });

  it('Calls onClick with correct index and image on button click.', () => {
    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={0} />,
    );
    fireEvent.click(screen.getByAltText('Thumbnail 1'));
    expect(handleClick).toHaveBeenCalledWith(1, mockImages[1]);
  });

  it('Prevents click if drag occurred.', () => {
    mockUseDrag.mockReturnValue({
      onMouseDown: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseUpOrLeave: jest.fn(),
      shouldCancelClick: () => true,
    });

    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={0} />,
    );
    fireEvent.click(screen.getByAltText('Thumbnail 2'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('Does nothing on mouseMove if not dragging.', () => {
    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={0} />,
    );
    const carousel = screen.getByTestId('image-carousel');
    const setSL = jest.fn();
    Object.defineProperty(carousel, 'scrollLeft', {
      set: setSL,
      get: () => 0,
      configurable: true,
    });
    fireEvent.mouseMove(carousel, { pageX: 200 });
    fireEvent.mouseUp(carousel);
    expect(setSL).not.toHaveBeenCalled();
  });

  it('Uses fallback image if urlThumbnail is missing.', () => {
    const fallback = {
      imageURLs: [{ id: '1', urlThumbnail: '' }],
    } as unknown as Letter;
    render(
      <ImageCarousel letter={fallback} onClick={handleClick} selected={0} />,
    );
    expect(screen.getByAltText('Thumbnail 0')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Falt-image.jpg&w=3840&q=75',
    );
  });

  it('Handles drag events and updates scrollLeft.', () => {
    mockUseDrag.mockReturnValue({
      onMouseDown: jest.fn(),
      onMouseMove: (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLDivElement;
        target.scrollLeft = 123;
      },
      onMouseUpOrLeave: jest.fn(),
      shouldCancelClick: () => false,
    });

    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={0} />,
    );
    const carousel = screen.getByTestId('image-carousel');
    const setSL = jest.fn();
    Object.defineProperty(carousel, 'scrollLeft', {
      set: setSL,
      get: () => 0,
      configurable: true,
    });

    fireEvent.mouseDown(carousel, { pageX: 100 });
    fireEvent.mouseMove(carousel, { pageX: 110 });
    fireEvent.mouseUp(carousel);

    expect(setSL).toHaveBeenCalled();
  });

  it('Does not cancel click for very small drags.', () => {
    mockUseDrag.mockReturnValue({
      onMouseDown: jest.fn(),
      onMouseMove: jest.fn(),
      onMouseUpOrLeave: jest.fn(),
      shouldCancelClick: () => false,
    });

    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={0} />,
    );
    fireEvent.click(screen.getByAltText('Thumbnail 0'));
    expect(handleClick).toHaveBeenCalledWith(0, mockImages[0]);
  });

  it('Prevents image dragStart.', () => {
    render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={0} />,
    );
    const btn = screen.getByAltText('Thumbnail 0');
    const drag = createEvent.dragStart(btn);
    drag.preventDefault = jest.fn();
    fireEvent(btn, drag);
    expect(drag.preventDefault).toHaveBeenCalled();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <ImageCarousel letter={mockLetter} onClick={handleClick} selected={1} />,
    );
    await expect(axe(container)).resolves.toHaveNoViolations();
  });
});
