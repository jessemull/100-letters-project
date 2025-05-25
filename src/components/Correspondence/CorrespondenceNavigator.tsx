'use client';

import Carousel from './ImageCarousel';
import CorrespondenceDetails from './CorrespondenceDetails';
import Image from 'next/image';
import { Correspondence } from '@ts-types/correspondence';
import {
  CorrespondenceNotFound,
  LetterDetails,
  LetterSelector,
  LetterSelectorMobile,
  LetterText,
  RecipientDetails,
} from '@components/Correspondence';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useSearchParams } from 'next/navigation';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

const CorrespondenceNavigator = () => {
  const { correspondencesById } = useCorrespondence();
  const searchParams = useSearchParams();

  const correspondenceId = searchParams.get('correspondenceId');
  const letterId = searchParams.get('letterId');

  const correspondence = useMemo(() => {
    if (!correspondenceId) return null;
    return correspondencesById[correspondenceId] || null;
  }, [correspondenceId, correspondencesById]) as Correspondence | null;

  const initialSelectedLetterIndex = useMemo(() => {
    if (!letterId || !correspondence) return 0;
    const index = correspondence.letters.findIndex(
      (letter) => letter.letterId === letterId,
    );
    return index !== -1 ? index : 0;
  }, [correspondence, letterId]);

  const [selectedLetterIndex, setSelectedLetterIndex] = useState(
    initialSelectedLetterIndex,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!letterId || !correspondence) return;
    const index = correspondence.letters.findIndex(
      (letter) => letter.letterId === letterId,
    );
    if (index !== -1) {
      setSelectedLetterIndex(index);
    }
  }, [correspondence, letterId]);

  if (!correspondence) {
    return <CorrespondenceNotFound />;
  }

  const selectedLetter = correspondence.letters[selectedLetterIndex];
  const selectedImage = selectedLetter.imageURLs[selectedImageIndex];
  const lightboxSlides = selectedLetter.imageURLs.map(({ url }) => ({
    src: url,
  }));

  return (
    <div className="font-merriweather max-w-7xl mx-auto px-4 py-4 md:py-16">
      <div className="flex flex-col md:flex-row md:gap-8 items-start">
        <div className="flex-1 space-y-6 text-white min-w-0 order-1 md:order-2">
          <CorrespondenceDetails correspondence={correspondence} />
          <RecipientDetails correspondence={correspondence} />
          <div className="hidden md:block">
            <LetterDetails letter={selectedLetter} />
          </div>
        </div>
        <div className="flex-1 space-y-4 min-w-0 w-full order-2 md:order-1">
          <div className="hidden lg:block">
            <LetterSelector
              letters={correspondence.letters}
              selected={selectedLetterIndex}
              onSelect={(idx) => {
                setSelectedLetterIndex(idx);
                setSelectedImageIndex(0);
              }}
            />
          </div>
          <div className="block lg:hidden">
            <LetterSelectorMobile
              letters={correspondence.letters}
              selected={selectedLetterIndex}
              onSelect={(idx) => {
                setSelectedLetterIndex(idx);
                setSelectedImageIndex(0);
              }}
            />
          </div>
          <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md max-w-full">
            <Image
              src={selectedImage?.url || '/missing.jpg'}
              alt="Selected letter"
              fill
              className="object-cover"
              priority
            />
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-2 right-2 z-20 bg-black/40 hover:bg-black/60 p-1.5 rounded-md transition"
              aria-label="Expand to fullscreen"
            >
              <Expand className="text-white/90 w-6 h-6" />
            </button>
          </div>
          <Carousel
            letter={selectedLetter}
            onClick={(idx) => setSelectedImageIndex(idx)}
            selected={selectedImageIndex}
          />
          <div className="pt-5 block md:hidden">
            <LetterDetails letter={selectedLetter} />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <LetterText letter={selectedLetter} />
      </div>
      {isLightboxOpen && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={lightboxSlides}
          index={selectedImageIndex}
          on={{
            view: ({ index }) => setSelectedImageIndex(index),
          }}
          plugins={[Zoom]}
          render={{
            iconPrev: () => (
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
                <ChevronLeft className="-translate-x-[1px] text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </span>
            ),
            iconNext: () => (
              <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
                <ChevronRight className="translate-x-[1px] text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </span>
            ),
            iconZoomIn: () => (
              <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            ),
            iconZoomOut: () => (
              <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            ),
            iconClose: () => (
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            ),
          }}
          zoom={{
            maxZoomPixelRatio: 5,
            zoomInMultiplier: 2,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            pinchZoomDistanceFactor: 100,
            wheelZoomDistanceFactor: 100,
          }}
        />
      )}
    </div>
  );
};

export default CorrespondenceNavigator;
