'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Categories } from '@components/Feed';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { Progress } from '@components/Form';
import { searchItemsPerPage } from '@constants/feed';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useInView } from 'react-intersection-observer';

interface Props {
  results: CorrespondenceCard[];
  term: string;
}

const Search: React.FC<Props> = ({ results, term }) => {
  const [page, setPage] = useState(1);
  const { correspondences } = useCorrespondence();

  const items = useMemo(
    () => (term ? results : correspondences),
    [term, results, correspondences],
  );

  const [trackedItems, setTrackedItems] = useState(items);
  if (items !== trackedItems) {
    setTrackedItems(items);
    setPage(1);
  }

  const visibleItems = useMemo(
    () => items.slice(0, page * searchItemsPerPage),
    [items, page],
  );

  const [ref, inView] = useInView({
    threshold: 0,
  });

  // setTimeout keeps setState out of the synchronous effect body.
  useEffect(() => {
    if (!inView || page * searchItemsPerPage >= items.length) return;

    const timeoutId = window.setTimeout(() => {
      setPage((prev) => prev + 1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [inView, page, items.length]);

  if (items.length === 0) {
    return (
      <>
        <p className="text-white text-center mt-8 text-lg">
          No matching letters or people found.
        </p>
        <Categories />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm-tablet:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
        {visibleItems.map((correspondence, idx) => (
          <Card
            correspondence={correspondence}
            key={correspondence.correspondenceId}
            loading={idx === 0 ? 'eager' : undefined}
            priority={idx === 0}
          />
        ))}
      </div>
      {visibleItems.length < items.length && (
        <div ref={ref} className="flex justify-center mt-8">
          <Progress color="white" size={16} />
        </div>
      )}
      <Categories />
    </>
  );
};

export default Search;
