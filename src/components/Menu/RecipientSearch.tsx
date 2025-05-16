import Link from 'next/link';
import { RecipientSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useSearch } from '@hooks/useSearch';
import { useSearchData } from '@contexts/SearchProvider';
import { useState } from 'react';

const RecipientSearch = () => {
  const [term, setTerm] = useState('');
  const { recipients } = useSearchData();
  const results = useSearch({
    type: 'recipients',
    term,
  }) as RecipientSearchItem[];
  return (
    <SearchSection<RecipientSearchItem>
      data={recipients}
      results={results}
      setTerm={setTerm}
      term={term}
      title="Recipients"
      renderItem={(item) => (
        <Link
          href={`/correspondence?correspondenceId=${item.correspondenceId}`}
          className="hover:underline"
        >
          {item.lastName}, {item.firstName}
        </Link>
      )}
    />
  );
};

export default RecipientSearch;
