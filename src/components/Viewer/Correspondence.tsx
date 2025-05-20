'use client';

import Image from 'next/image';
import Carousel from './Carousel';
import CorrespondenceDetails from './CorrespondenceDetails';
import LetterAccordion from './LetterAccordion';
import RecipientDetails from './RecipientDetails';
import { Correspondence as CorrespondenceType } from '@ts-types/correspondence';
import { useState } from 'react';

const Correspondence = ({
  correspondence,
}: {
  correspondence: CorrespondenceType;
}) => {
  const [selectedLetterIndex, setSelectedLetterIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedLetter = correspondence.letters[selectedLetterIndex];
  const selectedImage = selectedLetter.imageURLs[selectedImageIndex];
  console.log(
    selectedLetter,
    selectedImage,
    selectedLetterIndex,
    selectedImageIndex,
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
          <Image
            src={selectedImage?.url || './missing.jpg'}
            alt="Selected letter"
            fill
            className="object-cover"
          />
        </div>
        <Carousel
          letter={selectedLetter}
          onClick={(idx) => setSelectedImageIndex(idx)}
          selected={selectedImageIndex}
        />
      </div>
      <div className="space-y-6 text-white">
        <CorrespondenceDetails correspondence={correspondence} />
        <RecipientDetails correspondence={correspondence} />
        <LetterAccordion
          correspondence={correspondence}
          onClick={(idx) => {
            setSelectedLetterIndex(idx);
            setSelectedImageIndex(0); // 🔁 Reset image index when changing letter
          }}
          selected={selectedLetterIndex}
        />
      </div>
    </div>
  );
};

export default Correspondence;
