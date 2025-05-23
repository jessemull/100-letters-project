import Image from 'next/image';
import { Letter, LetterImage } from '@ts-types/letter';
import { viewMap } from '@constants/letter';

interface Props {
  letter: Letter;
  onClick: (idx: number, letter: LetterImage) => void;
  selected: number;
}

const ImageCarousel: React.FC<Props> = ({ letter, onClick, selected }) => (
  <div className="flex gap-2 overflow-x-auto items-center">
    {letter.imageURLs.map((image, idx) => {
      const isSelected = selected === idx;
      return (
        <button
          key={image.id}
          onClick={() => onClick(idx, image)}
          className="relative w-24 h-24 flex-shrink-0"
        >
          <div
            className={`group w-full h-full rounded overflow-hidden transition-transform duration-300 transform ${
              isSelected
                ? 'border border-white'
                : 'hover:border hover:border-white'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={letter.imageURLs[idx]?.urlThumbnail || './missing.jpg'}
                alt={`Thumbnail ${idx}`}
                fill
                className="object-cover"
              />
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isSelected ? 'bg-black/70' : ''
                }`}
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-xs font-medium rounded bg-white/80 text-black backdrop-blur-sm shadow-sm border border-black/10 z-10">
                {viewMap[letter.imageURLs[idx].view]}
              </span>
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

export default ImageCarousel;
