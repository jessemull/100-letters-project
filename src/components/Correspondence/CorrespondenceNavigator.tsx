'use client';

import Carousel from './ImageCarousel';
import Image from 'next/image';
import { Expand } from 'lucide-react';
import {
  CorrespondenceNotFound,
  LetterDetails,
  LetterSelector,
  LetterSelectorMobile,
  RecipientDetails,
} from '@components/Correspondence';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { Progress } from '@components/Form';
import { ProjectLightbox } from '@components/Lightbox';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const CorrespondenceNavigator = () => {
  const { correspondencesById, error, loading } = useCorrespondence();
  const searchParams = useSearchParams();

  const correspondenceId = searchParams.get('correspondenceId');
  const letterId = searchParams.get('letterId');

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [rightColumnHeight, setRightColumnHeight] = useState(0);

  const rightColumnRef = useCallback((element: HTMLDivElement) => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
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

  const letterIndexFromParams = useMemo(() => {
    if (!Array.isArray(letters) || letters.length === 0) return 0;
    const index = letters.findIndex((l) => l.letterId === letterId);
    return index !== -1 ? index : 0;
  }, [letters, letterId]);

  const [selectedLetterIndex, setSelectedLetterIndex] = useState(
    letterIndexFromParams,
  );
  const selectionKey = `${correspondenceId}:${letterId}`;
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey);

  if (selectionKey !== prevSelectionKey) {
    setPrevSelectionKey(selectionKey);
    setSelectedLetterIndex(letterIndexFromParams);
    setSelectedImageIndex(0);
  }

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

  if (error) {
    return (
      <CorrespondenceNotFound
        title="Unable to load correspondence."
        description="The correspondence data could not be loaded. Please try again later."
      />
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
        <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-[auto_min-content] gap-6 md:gap-8 mb-4">
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
              <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md group">
                <Image
                  priority
                  src={selectedImage?.url || '/alt-image.jpg'}
                  alt={
                    selectedImage &&
                    'caption' in selectedImage &&
                    selectedImage.caption
                      ? selectedImage.caption
                      : selectedLetter?.title || 'Selected letter'
                  }
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-2 right-2 z-20 bg-black/40 hover:bg-black/60 p-1.5 rounded-md transition cursor-pointer"
                  aria-label="Expand to fullscreen"
                >
                  <Expand className="text-white/90 w-6 h-6" />
                </button>
                {selectedImage &&
                  'caption' in selectedImage &&
                  selectedImage.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                      <p className="text-sm font-medium">
                        {selectedImage.caption}
                      </p>
                    </div>
                  )}
              </div>
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
        <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg break-words overflow-hidden mb-5">
          {selectedLetter?.title}
        </h2>

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
        <ProjectLightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={lightboxSlides}
          index={selectedImageIndex}
          onView={(nextIndex) => setSelectedImageIndex(nextIndex)}
        />
      )}
    </div>
  );
};

export default CorrespondenceNavigator;
