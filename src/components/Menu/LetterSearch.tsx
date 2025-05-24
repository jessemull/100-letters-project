import { LetterSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useRouter } from 'next/navigation';
import { useSearch } from '@hooks/useSearch';
import { useSearchData } from '@contexts/SearchProvider';
import { useState } from 'react';

const LetterSearch = () => {
  const [term, setTerm] = useState('');

  const { letters } = useSearchData();

  const router = useRouter();

  const results = useSearch({
    type: 'letters',
    term,
  }) as LetterSearchItem[];

  const onItemClick = ({ correspondenceId, letterId }: LetterSearchItem) => {
    router.push(
      `/correspondence?correspondenceId=${correspondenceId}&letterId=${letterId}`,
    );
  };

  return (
    <SearchSection<LetterSearchItem>
      data={letters}
      onItemClick={onItemClick}
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
