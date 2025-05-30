import { RecipientSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useRouter } from 'next/navigation';
import { useSearch } from '@hooks/useSearch';
import { useSearchData } from '@contexts/SearchProvider';
import { useState } from 'react';

interface Props {
  onClick?: () => void;
}

const RecipientSearch: React.FC<Props> = ({ onClick }) => {
  const [term, setTerm] = useState('');

  const { recipients } = useSearchData();

  const router = useRouter();

  const results = useSearch({
    type: 'recipients',
    term,
  }) as RecipientSearchItem[];

  const onItemClick = ({ correspondenceId }: RecipientSearchItem) => {
    if (onClick) {
      onClick();
    }
    router.push(`/correspondence?correspondenceId=${correspondenceId}`);
  };

  return (
    <SearchSection<RecipientSearchItem>
      data={recipients}
      onItemClick={onItemClick}
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
