'use client';

import Carousel from './ImageCarousel';
import CorrespondenceDetails from './CorrespondenceDetails';
import Image from 'next/image';
import { Correspondence as CorrespondenceType } from '@ts-types/correspondence';
import {
  LetterDetails,
  LetterSelector,
  LetterText,
  RecipientDetails,
} from '@components/CorrespondenceNavigator';
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
    <div className="font-merriweather max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0">
          <LetterSelector
            letters={correspondence.letters}
            selected={selectedLetterIndex}
            onSelect={(idx) => {
              setSelectedLetterIndex(idx);
              setSelectedImageIndex(0);
            }}
          />
        </div>
        <div className="flex-1 space-y-4 min-w-0">
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
        <div className="flex-1 space-y-6 text-white min-w-0">
          <CorrespondenceDetails correspondence={correspondence} />
          <RecipientDetails correspondence={correspondence} />
          <LetterDetails letter={selectedLetter} />
        </div>
      </div>
      <LetterText letter={selectedLetter} />
    </div>
  );
};

export default CorrespondenceNavigator;
