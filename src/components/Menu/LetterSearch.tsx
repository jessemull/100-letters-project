import Link from 'next/link';
import { LetterSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useSearch } from '@hooks/useSearch';
import { useSearchData } from '@contexts/SearchProvider';
import { useState } from 'react';

const LetterSearch = () => {
  const [term, setTerm] = useState('');
  const { letters } = useSearchData();
  const results = useSearch({
    type: 'letters',
    term,
  }) as LetterSearchItem[];
  return (
    <SearchSection<LetterSearchItem>
      data={letters}
      results={results}
      setTerm={setTerm}
      term={term}
      title="Letters"
      renderItem={(item) => (
        <span className="hover:underline cursor-pointer">{item.title}</span>
      )}
    />
  );
};

export default LetterSearch;
