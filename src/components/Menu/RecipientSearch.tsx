import { RecipientSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useMemo, useState } from 'react';
import { useSearchData } from '@contexts/SearchProvider';

interface Props {
  onClick?: () => void;
}

const RecipientSearch: React.FC<Props> = ({ onClick }) => {
  const [term, setTerm] = useState('');
  const { recipients } = useSearchData();

  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (!query) return [] as RecipientSearchItem[];
    return recipients.filter(
      (item) =>
        item.fullName?.toLowerCase().includes(query) ||
        item.firstName.toLowerCase().includes(query) ||
        item.lastName.toLowerCase().includes(query),
    );
  }, [recipients, term]);

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
