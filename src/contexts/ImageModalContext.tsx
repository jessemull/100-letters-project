'use client';

import Image from 'next/image';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { X } from 'lucide-react';

type ImageModalContextType = {
  showImage: (src: string, alt?: string) => void;
  hideImage: () => void;
};

export const ImageModalContext = createContext<ImageModalContextType | null>(
  null,
);

export const ImageModalProvider = ({ children }: { children: ReactNode }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [altText, setAltText] = useState<string>('');

  const showImage = (src: string, alt: string = '') => {
    setImageSrc(src);
    setAltText(alt);
  };

  const hideImage = () => {
    setImageSrc(null);
    setAltText('');
  };

  useEffect(() => {
    if (imageSrc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [imageSrc]);

  return (
    <ImageModalContext.Provider value={{ showImage, hideImage }}>
      {children}
      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 overflow-auto flex items-center justify-center">
          <div className="relative border-4 border-white rounded-xl bg-black max-w-full max-h-[90vh] overflow-auto">
            <button
              onClick={hideImage}
              className="absolute -top-4 -right-4 text-white p-1 hover:text-gray-300 shadow-lg p-4"
              aria-label="Close"
            >
              <X className="border border-white rounded-full w-6 h-6" />
            </button>
            <div className="w-[400px] md:w-[800px]">
              <Image
                alt={altText}
                src={imageSrc}
                width={800}
                height={0}
                style={{ height: 'auto', maxHeight: '90vh' }}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 400px, 800px"
              />
            </div>
          </div>
        </div>
      )}
    </ImageModalContext.Provider>
  );
};

export const useImageModal = () => {
  const context = useContext(ImageModalContext);
  if (!context) {
    throw new Error('useImageModal must be used within an ImageModalProvider');
  }
  return context;
};
