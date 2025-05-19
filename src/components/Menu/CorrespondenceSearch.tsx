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
        <span className="hover:underline cursor-pointer">{item.title}</span>
      )}
    />
  );
};

export default CorrespondenceSearch;
