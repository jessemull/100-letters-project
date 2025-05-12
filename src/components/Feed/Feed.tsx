'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Image } from '@components/Admin/Letters';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';

type CountDown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const calculateCountdown = (targetDate: Date) => {
  const now = new Date();
  const diff = new Date(targetDate).getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
};

interface Category {
  name: string;
  imageUrl: string;
}

interface Props {
  categories: Category[];
}

const Feed: React.FC<Props> = ({ categories }) => {
  const [countdown, setCountdown] = useState<null | CountDown>(null);
  const [numCategoryRows, setNumCategoryRows] = useState(2);
  const [numLetterRows, setNumLetterPages] = useState(1);

  const { correspondences, earliestSentAtDate, responseCompletion } =
    useCorrespondence();

  const showMoreCategories = useMemo(() => {
    return numCategoryRows * 6 < categories.length;
  }, [categories.length, numCategoryRows]);

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
    <div className="relative flex flex-col items-center text-white min-h-screen py-10 px-4 font-merriweather w-full">
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center space-y-12">
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
              The <strong>100 Letters Project</strong> is driven by the desire
              to promote real-world human interaction in an increasingly digital
              landscape and create meaningful connections through handwritten
              communication. Over the course of a year, I will write 100 letters
              to 100 individuals.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {correspondences
                .slice(0, numLetterRows * 3)
                .map(
                  ({ correspondenceId, letters, reason, recipient, title }) => (
                    <div
                      key={correspondenceId}
                      className="rounded-xl overflow-hidden shadow-lg text-black font-merriweather cursor-pointer transform transition duration-200 hover:scale-[1.02]"
                    >
                      <Image
                        src={
                          letters[0]?.imageURLs[0]?.urlThumbnail ||
                          '/missing.jpg'
                        }
                        alt={letters[0]?.title || 'Letter Image'}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 bg-white/10 h-full">
                        <h3 className="text-lg text-white font-bold">
                          {title}
                        </h3>
                        <p className="text-sm text-white">{`${recipient.lastName}, ${recipient.firstName}`}</p>
                        <p className="text-sm text-white italic">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
            </div>
          )}
        </div>
        {showMoreLetters && (
          <button
            className="bg-white/10 hover:bg-white/20 border rounded-3xl border-white p-4"
            id="show-more-letters"
            data-testid="show-more-letters"
            onClick={() => setNumLetterPages(numLetterRows + 1)}
          >
            View More Letters +
          </button>
        )}
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden group cursor-pointer h-32"
              >
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold font-merriweather">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {showMoreCategories && (
            <div className="flex justify-center pt-4">
              <button
                className="bg-white/10 hover:bg-white/20 border rounded-3xl border-white p-4"
                id="show-more-categories"
                data-testid="show-more-categories"
                onClick={() => setNumCategoryRows(numCategoryRows + 1)}
              >
                See More +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
