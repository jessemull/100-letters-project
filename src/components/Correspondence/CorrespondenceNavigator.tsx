'use client';

import 'yet-another-react-lightbox/styles.css';
import Carousel from './ImageCarousel';
import CorrespondenceDetails from './CorrespondenceDetails';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  CorrespondenceNotFound,
  LetterDetails,
  LetterSelector,
  LetterSelectorMobile,
  RecipientDetails,
} from '@components/Correspondence';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { Progress } from '@components/Form';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const CorrespondenceNavigator = () => {
  const { correspondencesById } = useCorrespondence();
  const searchParams = useSearchParams();

  const correspondenceId = searchParams.get('correspondenceId');
  const letterId = searchParams.get('letterId');

  const [selectedLetterIndex, setSelectedLetterIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const correspondence: CorrespondenceCard | null = useMemo(() => {
    if (!correspondenceId) return null;
    return correspondencesById[correspondenceId] || null;
  }, [correspondenceId, correspondencesById]);

  const letters = useMemo(
    () => correspondence?.letters || [],
    [correspondence],
  );

  useEffect(() => {
    if (!correspondence) {
      setLoading(false);
      return;
    }

    if (!Array.isArray(letters) || letters.length === 0) {
      setLoading(false);
      return;
    }

    const index = letters.findIndex((l) => l.letterId === letterId);
    setSelectedLetterIndex(index !== -1 ? index : 0);
    setLoading(false);
  }, [correspondence, letterId, letters]);

  if (!correspondenceId) {
    return <CorrespondenceNotFound />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Progress color="white" size={16} />
      </div>
    );
  }

  if (!correspondence || !Array.isArray(letters) || letters.length === 0) {
    return <CorrespondenceNotFound />;
  }

  const selectedLetter = letters[selectedLetterIndex];

  const selectedImage = Array.isArray(selectedLetter?.imageURLs)
    ? selectedLetter.imageURLs[selectedImageIndex]
    : { url: '/alt-image.jpg' };

  const lightboxSlides = Array.isArray(selectedLetter?.imageURLs)
    ? selectedLetter.imageURLs.map(({ url }) => ({ src: url }))
    : [];

  return (
    <div className="font-merriweather max-w-7xl mx-auto py-4 px-4 md:px-0 md:py-12">
      <div className="flex flex-col md:flex-row md:gap-8 items-start">
        <div className="flex-1 space-y-6 text-white min-w-0 order-1 md:order-2">
          <CorrespondenceDetails correspondence={correspondence} />
          <RecipientDetails correspondence={correspondence} />
        </div>
        <div className="flex-1 md:mt-0 min-w-0 w-full order-2 md:order-1">
          <div className="hidden lg:block">
            <LetterSelector
              category={correspondence.reason.category}
              letters={letters}
              selected={selectedLetterIndex}
              onSelect={(idx) => {
                setSelectedLetterIndex(idx);
                setSelectedImageIndex(0);
              }}
            />
          </div>
          <div className="block md:mt-0 lg:hidden">
            <LetterSelectorMobile
              category={correspondence.reason.category}
              letters={letters}
              selected={selectedLetterIndex}
              onSelect={(idx) => {
                setSelectedLetterIndex(idx);
                setSelectedImageIndex(0);
              }}
            />
          </div>
          <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md max-w-full mb-4">
            <Image
              priority
              onClick={() => setIsLightboxOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsLightboxOpen(true);
                }
              }}
              role="button"
              tabIndex={0}
              src={selectedImage?.url || '/alt-image.jpg'}
              alt="Selected letter"
              fill
              className="object-cover cursor-pointer outline-none"
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
          <div className="pt-2 lg:pt-5 block md:hidden">
            <LetterDetails letter={selectedLetter} />
          </div>
        </div>
      </div>
      <div className="mt-8 md:mt-6">
        {/* Letter Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg break-words overflow-hidden mb-8">
          {selectedLetter?.title}
        </h1>

        {/* Letter Details - appears after title on larger devices */}
        <div className="mb-8 hidden md:block">
          <LetterDetails letter={selectedLetter} />
        </div>

        {/* Letter Text Content */}
        <div className="text-white/90 whitespace-pre-line break-words overflow-hidden">
          {selectedLetter?.text}
        </div>
      </div>
      {isLightboxOpen && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={lightboxSlides}
          index={selectedImageIndex}
          on={{ view: ({ index }) => setSelectedImageIndex(index) }}
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
              <ZoomIn className="w-6 h-6 text-white hover:text-gray-300 transition-colors duration-200" />
            ),
            iconZoomOut: () => (
              <ZoomOut className="w-6 h-6 text-white hover:text-gray-300 transition-colors duration-200" />
            ),
            iconClose: () => (
              <X className="w-6 h-6 text-white hover:text-gray-300 transition-colors duration-200" />
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
