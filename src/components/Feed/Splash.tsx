'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@components/Feed';
import { CountDown } from '@ts-types/feed';
import { calculateCountdown } from '@util/feed';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { Categories } from '@components/Feed';

const Splash = () => {
  const { correspondences, earliestSentAtDate, responseCompletion } =
    useCorrespondence();
  const [countdown, setCountdown] = useState<null | CountDown>(null);
  const [numLetterRows, setNumLetterPages] = useState(1);

  const showMoreLetters = useMemo(() => {
    return numLetterRows * 3 < correspondences.length;
  }, [correspondences, numLetterRows]);

  useEffect(() => {
    if (!earliestSentAtDate) return;

    const targetDate = new Date(earliestSentAtDate);
    targetDate.setFullYear(targetDate.getFullYear() + 1);

    const interval = setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [earliestSentAtDate]);

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">The 100 Letters Project</h1>
        <p className="text-lg">{correspondences.length} Letters Written</p>
        <p className="text-lg">
          Respond-o-meter:{' '}
          {(responseCompletion * 100).toFixed(1).replace(/\.0$/, '')}%
        </p>
        {countdown ? (
          <p className="text-lg">
            Countdown to the Letter-o-calypse:{' '}
            <span className="font-semibold">
              {countdown.days}d {countdown.hours}h {countdown.minutes}m{' '}
              {countdown.seconds}s
            </span>
          </p>
        ) : (
          <p>Countdown clock kicking off soon...</p>
        )}
      </div>
      <div className="w-full space-y-8">
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
