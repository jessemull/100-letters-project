'use client';

import Envelope from './Envelope';
import { useRef, MutableRefObject, useState, useEffect } from 'react';

const Feed = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 3500);
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-gray-100 flex flex-col items-center p-16 md:p-32"
    >
      {!showContent && (
        <Envelope
          containerRef={containerRef as MutableRefObject<HTMLElement>}
        />
      )}
      {showContent && (
        <div
          className={`font-merriweather flex flex-col items-center text-center space-y-4 transition-all duration-[1000ms] ease-in ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-xl text-gray-500 font-bold">Coming Soon...</p>
          <p className="text-lg text-gray-500 md:w-2/3 lg:2-2/3 xl:w-1/2 md:mx-auto">
            The <strong>100 Letters Project</strong> is driven by the desire to
            promote real-world human interaction in an increasingly digital
            landscape and create meaningful connections through handwritten
            communication. Over the course of a year, I will write 100 letters
            to 100 individuals.
          </p>
          <p className="text-lg text-gray-500 md:w-2/3 lg:w-2/3 xl:w-1/2 md:mx-auto">
            This website will showcase these exchanges, offering a digital
            display of the letters with details about the recipients and the
            reasons behind their selection.
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;
