'use client';

import 'yet-another-react-lightbox/styles.css';
import Carousel from './ImageCarousel';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [rightColumnHeight, setRightColumnHeight] = useState(0);

  const rightColumnRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        console.log('ResizeObserver fired with height:', height);
        setRightColumnHeight(height);
      }
    });

    resizeObserver.observe(element);

    const initialHeight = element.getBoundingClientRect().height;

    setRightColumnHeight(initialHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

  const scrollToLetterText = () => {
    const letterElement = document.getElementById('letter-text-section');
    if (letterElement) {
      letterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="font-merriweather max-w-7xl mx-auto py-4 px-4 md:px-0 md:py-12">
      <div className="flex flex-col space-y-6">
        {/* CSS Grid Layout for precise alignment */}
        <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-[auto_min-content] gap-6 md:gap-8 mb-4">
          {/* Correspondence Title and Description */}
          <div className="md:col-span-3 text-white space-y-2 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {correspondence?.title}
            </h1>
            <p className="italic text-white/90">
              {correspondence?.reason?.description}
            </p>
          </div>
          <div className="hidden md:block md:col-span-2">
            <LetterSelector
              letters={letters}
              selected={selectedLetterIndex}
              onSelect={(idx) => {
                setSelectedLetterIndex(idx);
                setSelectedImageIndex(0);
              }}
              onScrollToText={scrollToLetterText}
            />
          </div>
          <div className="md:col-span-3 md:row-start-2 mb-3 md:mb-0">
            <RecipientDetails
              correspondence={correspondence}
              dynamicHeight={rightColumnHeight}
            />
          </div>
          <div className="block md:hidden col-span-1">
            <LetterSelectorMobile
              letters={letters}
              selected={selectedLetterIndex}
              onSelect={(idx) => {
                setSelectedLetterIndex(idx);
                setSelectedImageIndex(0);
              }}
              onScrollToText={scrollToLetterText}
            />
          </div>
          <div className="md:col-span-2 md:row-start-2 -mt-3 md:mt-0">
            <div ref={rightColumnRef} className="space-y-4">
              <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md">
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

              {/* Thumbnail Carousel */}
              <div>
                <Carousel
                  letter={selectedLetter}
                  onClick={(idx) => setSelectedImageIndex(idx)}
                  selected={selectedImageIndex}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 md:mt-10" id="letter-text-section">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg break-words overflow-hidden mb-5">
          {selectedLetter?.title}
        </h1>

        <div className="pt-5 pb-5 border-t border-b border-white/70 mb-10">
          <LetterDetails letter={selectedLetter} />
        </div>

        <div
          className="text-white/90 whitespace-pre-line break-words overflow-hidden"
          data-testid="letter-text"
        >
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
