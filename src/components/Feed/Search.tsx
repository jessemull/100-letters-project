'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Categories } from '@components/Feed';
import { Correspondence } from '@ts-types/correspondence';
import { Progress } from '@components/Form';
import { SearchAllItem } from '@ts-types/search';
import { searchItemsPerPage } from '@constants/feed';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useInView } from 'react-intersection-observer';

interface Props {
  results: SearchAllItem[];
  term: string;
}

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
    setVisibleItems(items.slice(0, searchItemsPerPage));
  }, [items]);

  useEffect(() => {
    if (inView && visibleItems.length < items.length) {
      const nextPage = page + 1;
      const nextItems = items.slice(0, nextPage * searchItemsPerPage);
      setVisibleItems(nextItems);
      setPage(nextPage);
    }
  }, [inView, items, page, visibleItems.length]);

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
