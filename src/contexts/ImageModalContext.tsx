'use client';

import { X } from 'lucide-react';
import { createContext, useContext, useState, ReactNode } from 'react';

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

  return (
    <ImageModalContext.Provider value={{ showImage, hideImage }}>
      {children}
      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-[800px] w-full max-h-full overflow-auto border-4 border-white rounded-xl bg-black">
            <button
              onClick={hideImage}
              className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={imageSrc}
              alt={altText}
              className="rounded-xl max-w-full max-h-[calc(100vh-4rem)] mx-auto"
            />
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
