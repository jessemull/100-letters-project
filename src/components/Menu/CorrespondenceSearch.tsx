import { CorrespondenceSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useMemo, useState } from 'react';
import { useSearchData } from '@contexts/SearchProvider';

interface Props {
  onClick?: () => void;
}

const CorrespondenceSearch: React.FC<Props> = ({ onClick }) => {
  const [term, setTerm] = useState('');
  const { correspondences } = useSearchData();

  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    if (!query) return [] as CorrespondenceSearchItem[];
    return correspondences.filter((item) =>
      item.title.toLowerCase().includes(query),
    );
  }, [correspondences, term]);

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
