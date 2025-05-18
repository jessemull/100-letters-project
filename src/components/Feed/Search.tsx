'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@components/Feed';
import { Progress } from '@components/Form';
import { SearchAllItem } from '@ts-types/search';
import { useInView } from 'react-intersection-observer';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { Correspondence } from '@ts-types/correspondence';

interface Props {
  results: SearchAllItem[];
  term: string;
}

const ITEMS_PER_PAGE = 6;

const Search: React.FC<Props> = ({ results, term }) => {
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView({ threshold: 0 });
  const [visibleItems, setVisibleItems] = useState<
    SearchAllItem[] | Correspondence[]
  >([]);

  const { correspondences } = useCorrespondence();

  const items = useMemo(
    () => (term ? results : correspondences),
    [term, results, correspondences],
  );

  useEffect(() => {
    setPage(1);
    setVisibleItems(items.slice(0, ITEMS_PER_PAGE));
  }, [items]);

  useEffect(() => {
    if (inView && visibleItems.length < results.length) {
      const nextPage = page + 1;
      const nextItems = results.slice(0, nextPage * ITEMS_PER_PAGE);
      setVisibleItems(nextItems);
      setPage(nextPage);
    }
  }, [inView]);

  if (items.length === 0) {
    return (
      <p className="text-white text-center mt-8 text-lg">
        No matching letters or people found.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
        {visibleItems.map((correspondence, idx) => (
          <Card
            correspondence={correspondence}
            key={correspondence.correspondenceId}
            loading={idx === 0 ? 'eager' : undefined}
            priority={idx === 0}
          />
        ))}
      </div>
      {visibleItems.length < results.length && (
        <div ref={ref} className="flex justify-center mt-8">
          <Progress color="white" size={16} />
        </div>
      )}
    </>
  );
};

export default Search;
