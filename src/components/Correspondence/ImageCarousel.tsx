import Image from 'next/image';
import { Letter, LetterImage } from '@ts-types/letter';

interface Props {
  letter: Letter;
  onClick: (idx: number, letter: LetterImage) => void;
  selected: number;
}

const ImageCarousel: React.FC<Props> = ({ letter, onClick, selected }) => (
  <div className="w-full overflow-x-auto -mx-4 px-4">
    <div className="flex gap-2 items-center min-w-full">
      {letter.imageURLs.map((image, idx) => {
        const isSelected = selected === idx;
        return (
          <button
            key={image.id}
            onClick={() => onClick(idx, image)}
            className="relative w-24 h-24 flex-shrink-0 border-2 border-transparent"
          >
            <div
              className={`group w-full h-full rounded overflow-hidden transition-transform duration-300 transform ${
                isSelected ? 'border-white' : 'hover:border-white'
              }`}
            >
              <div className="relative w-24 h-24 flex-shrink-0 group hover:scale-105 transition-transform duration-300 ease-out">
                <Image
                  src={letter.imageURLs[idx]?.urlThumbnail || '/missing.jpg'}
                  alt={`Thumbnail ${idx}`}
                  fill
                  className="object-cover"
                />
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2'
                      : 'hover:ring hover:ring-white/50'
                  }`}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default ImageCarousel;
