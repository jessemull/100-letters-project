import Link from 'next/link';
import { CorrespondenceSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useSearch } from '@hooks/useSearch';
import { useSearchData } from '@contexts/SearchProvider';
import { useState } from 'react';

const CorrespondenceSearch = () => {
  const [term, setTerm] = useState('');
  const { correspondences } = useSearchData();
  const results = useSearch({
    type: 'letters',
    term,
  }) as CorrespondenceSearchItem[];
  return (
    <SearchSection<CorrespondenceSearchItem>
      data={correspondences}
      results={results}
      setTerm={setTerm}
      term={term}
      title="Correspondences"
      renderItem={(item) => (
        <Link
          href={`/correspondence?correspondenceId=${item.correspondenceId}`}
          className="hover:underline"
        >
          {item.title}
        </Link>
      )}
    />
  );
};

export default CorrespondenceSearch;
