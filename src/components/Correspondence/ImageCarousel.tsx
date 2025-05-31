import Image from 'next/image';
import React, { useRef } from 'react';
import { Letter, LetterImage } from '@ts-types/letter';
import { useDrag } from '@hooks/useDrag';

interface Props {
  letter: Letter;
  onClick: (idx: number, letter: LetterImage) => void;
  selected: number;
}

const ImageCarousel: React.FC<Props> = ({ letter, onClick, selected }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUpOrLeave, shouldCancelClick } =
    useDrag(containerRef as React.RefObject<HTMLDivElement>);
  return (
    <div
      ref={containerRef}
      data-testid="image-carousel"
      className="w-full overflow-x-auto scrollbar-hide-unless-hover cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUpOrLeave}
      onMouseLeave={onMouseUpOrLeave}
      role="presentation"
    >
      <div className="flex gap-2 items-center min-w-full select-none py-1 px-0.5">
        {letter.imageURLs.map((image, idx) => {
          const isSelected = selected === idx;
          return (
            <button
              key={image.id}
              data-testid={`thumbnail-${idx}`}
              className={`snap-start relative w-24 h-24 flex-shrink-0 overflow-hidden rounded ${
                isSelected
                  ? 'border border-white'
                  : 'hover:border hover:border-white'
              }`}
              draggable={false}
              onClick={(e) => {
                if (shouldCancelClick()) {
                  e.preventDefault();
                  return;
                }
                onClick(idx, image);
              }}
              onDragStart={(e) => e.preventDefault()}
            >
              <Image
                src={image.urlThumbnail || '/alt-image.jpg'}
                alt={`Thumbnail ${idx}`}
                fill
                className="object-cover transition-transform duration-300 ease-out hover:scale-105"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageCarousel;
