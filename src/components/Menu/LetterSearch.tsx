import { LetterSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useMemo, useState } from 'react';
import { useSearchData } from '@contexts/SearchProvider';

interface Props {
  onClick?: () => void;
}

const LetterSearch: React.FC<Props> = ({ onClick }) => {
  const [term, setTerm] = useState('');
  const { letters } = useSearchData();

  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (!query) return [] as LetterSearchItem[];
    return letters.filter((item) => item.title.toLowerCase().includes(query));
  }, [letters, term]);

  return (
    <SearchSection<LetterSearchItem>
      data={letters}
      getHref={({ correspondenceId, letterId }) =>
        `/correspondence?correspondenceId=${correspondenceId}&letterId=${letterId}`
      }
      getItemKey={({ letterId }) => letterId}
      onNavigate={onClick}
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
