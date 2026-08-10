import { CorrespondenceSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useSearch } from '@hooks/useSearch';
import { useSearchData } from '@contexts/SearchProvider';
import { useState } from 'react';

interface Props {
  onClick?: () => void;
}

const CorrespondenceSearch: React.FC<Props> = ({ onClick }) => {
  const [term, setTerm] = useState('');
  const { correspondences } = useSearchData();

  const results = useSearch({
    term,
    type: 'correspondences',
  }) as CorrespondenceSearchItem[];

  return (
    <SearchSection<CorrespondenceSearchItem>
      data={correspondences}
      getHref={({ correspondenceId }) =>
        `/correspondence?correspondenceId=${correspondenceId}`
      }
      getItemKey={({ correspondenceId }) => correspondenceId}
      onNavigate={onClick}
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
