'use client';

import Carousel from './ImageCarousel';
import CorrespondenceDetails from './CorrespondenceDetails';
import Image from 'next/image';
import LetterDetails from './LetterDetails';
import LetterSelector from './LetterSelector';
import RecipientDetails from './RecipientDetails';
import { Correspondence as CorrespondenceType } from '@ts-types/correspondence';
import { useState } from 'react';

const CorrespondenceNavigator = ({
  correspondence,
}: {
  correspondence: CorrespondenceType;
}) => {
  const [selectedLetterIndex, setSelectedLetterIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedLetter = correspondence.letters[selectedLetterIndex];
  const selectedImage = selectedLetter.imageURLs[selectedImageIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <LetterSelector
          letters={correspondence.letters}
          selected={selectedLetterIndex}
          onSelect={(idx) => {
            setSelectedLetterIndex(idx);
            setSelectedImageIndex(0);
          }}
        />
        <div className="md:w-1/2 space-y-6 text-white">
          <CorrespondenceDetails correspondence={correspondence} />
          <RecipientDetails correspondence={correspondence} />
          <LetterDetails letter={selectedLetter} />
        </div>
        <div className="md:w-1/2 space-y-4">
          <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md">
            <Image
              src={selectedImage?.url || '/missing.jpg'}
              alt="Selected letter"
              fill
              className="object-cover"
              priority
            />
          </div>
          <Carousel
            letter={selectedLetter}
            onClick={(idx) => setSelectedImageIndex(idx)}
            selected={selectedImageIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default CorrespondenceNavigator;
