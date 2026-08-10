import { RecipientSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useSearch } from '@hooks/useSearch';
import { useSearchData } from '@contexts/SearchProvider';
import { useState } from 'react';

interface Props {
  onClick?: () => void;
}

const RecipientSearch: React.FC<Props> = ({ onClick }) => {
  const [term, setTerm] = useState('');
  const { recipients } = useSearchData();

  const results = useSearch({
    type: 'recipients',
    term,
  }) as RecipientSearchItem[];

  return (
    <SearchSection<RecipientSearchItem>
      data={recipients}
      getHref={({ correspondenceId }) =>
        `/correspondence?correspondenceId=${correspondenceId}`
      }
      getItemKey={({ correspondenceId, firstName, lastName }) =>
        `${correspondenceId}-${lastName}-${firstName}`
      }
      onNavigate={onClick}
      results={results}
      setTerm={setTerm}
      term={term}
      title="Recipients"
      renderItem={(item) => (
        <span className="hover:underline cursor-pointer">
          {item.lastName}, {item.firstName}
        </span>
      )}
    />
  );
};

export default RecipientSearch;
