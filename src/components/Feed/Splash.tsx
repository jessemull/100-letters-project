'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Clock, ClockSkeleton, Completion } from '@components/Feed';
import { Categories } from '@components/Feed';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';

const Splash = () => {
  const { correspondences, earliestSentAtDate, responseCompletion } =
    useCorrespondence();
  const [numLetterRows, setNumLetterPages] = useState(1);
  const [showClock, setShowClock] = useState(false);

  const showMoreLetters = useMemo(() => {
    return numLetterRows * 3 < correspondences.length;
  }, [correspondences, numLetterRows]);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setShowClock(true));
    } else {
      setTimeout(() => setShowClock(true), 2000);
    }
  }, []);

  return (
    <>
      <div className="text-center space-y-4">
        <div className="pb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            The 100 Letters Project
          </h1>
          <h2 className="text-md md:text-lg font-medium">
            100 Letters, 100 People, 1 Year.
          </h2>
        </div>
        <Completion
          responseCompletion={responseCompletion}
          letterCount={correspondences.length}
        />
        {showClock ? (
          <Clock earliestSentAtDate={earliestSentAtDate} />
        ) : (
          <ClockSkeleton />
        )}
      </div>
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold text-center">{`Recent Letters${correspondences.length === 0 ? ' Coming Soon!' : ''}`}</h2>
        {correspondences.length === 0 ? (
          <p className="text-lg text-white text-center md:w-2/3 lg:w-2/3 xl:w-1/2 md:mx-auto">
            The <strong>100 Letters Project</strong> is driven by the desire to
            promote real-world human interaction in an increasingly digital
            landscape and create meaningful connections through handwritten
            communication. Over the course of a year, I will write 100 letters
            to 100 individuals.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {correspondences
              .slice(0, numLetterRows * 3)
              .map((correspondence, idx) => (
                <Card
                  correspondence={correspondence}
                  key={correspondence.correspondenceId}
                  loading={idx === 0 ? 'eager' : undefined}
                  priority={idx === 0}
                />
              ))}
          </div>
        )}
      </div>
      {showMoreLetters && (
        <button
          className="bg-white/10 hover:bg-white/20 border rounded-3xl border-white pr-4 pl-4 pt-2 pb-2"
          id="show-more-letters"
          data-testid="show-more-letters"
          onClick={() => setNumLetterPages(numLetterRows + 1)}
        >
          View More Letters +
        </button>
      )}
      <Categories />
    </>
  );
};

export default Splash;
