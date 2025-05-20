import Image from 'next/image';
import { Letter, LetterImage, LetterType } from '@ts-types/letter';

interface Props {
  letter: Letter;
  onClick: (idx: number, letter: LetterImage) => void;
  selected: number;
}

const Carousel: React.FC<Props> = ({ letter, onClick, selected }) => (
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
              {/* Image */}
              <Image
                src={letter.imageURLs[idx]?.urlThumbnail || './missing.jpg'}
                alt={`Thumbnail ${idx}`}
                fill
                className="object-cover"
              />
              {/* Dark overlay */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isSelected ? 'bg-black/70' : ''
                }`}
              />
              {/* Label */}
              <span className="absolute bottom-1 left-1 bg-black text-xs px-1 rounded-3xl text-white z-10">
                {LetterType[letter.type]}
              </span>
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

export default Carousel;
