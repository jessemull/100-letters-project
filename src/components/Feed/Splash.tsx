'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, ClockSkeleton, Completion } from '@components/Feed';
import { Categories } from '@components/Feed';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';

const Clock = dynamic(() => import('@components/Feed/Clock'), {
  ssr: false,
  loading: () => <ClockSkeleton />,
});

const Splash = () => {
  const { correspondences } = useCorrespondence();
  const [numLetterRows, setNumLetterPages] = useState(1);

  const showMoreLetters = useMemo(() => {
    return numLetterRows * 3 < correspondences.length;
  }, [correspondences, numLetterRows]);

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          The 100 Letters Project
        </h1>
        <h2 className="text-md md:text-lg font-medium">
          100 Letters, 100 People, 1 Year.
        </h2>
        <div className="pt-6 space-y-4">
          <Completion />
          <Clock />
        </div>
      </div>
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold text-center">{`Recent Letters${correspondences.length === 0 ? ' Coming Soon!' : ''}`}</h2>
        {correspondences.length === 0 ? (
          <>
            <p className="text-lg text-white text-center md:w-2/3 lg:w-2/3 xl:w-1/2 md:mx-auto">
              The <strong>100 Letters Project</strong> is driven by the desire
              to promote real-world human interaction in an increasingly digital
              landscape.
            </p>
            <p className="text-lg text-white text-center md:w-2/3 lg:w-2/3 xl:w-1/2 md:mx-auto">
              Over the course of a year, I will write 100 letters to 100
              individuals.
            </p>
            <p className="text-lg text-white text-center md:w-2/3 lg:w-2/3 xl:w-1/2 md:mx-auto">
              Please check in soon for the very first letter!
            </p>
          </>
        ) : (
          <div className="grid grid-cols-1 sm-tablet:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
