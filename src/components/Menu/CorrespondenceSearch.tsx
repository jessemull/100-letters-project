import { CorrespondenceSearchItem } from '@ts-types/search';
import { SearchSection } from '@components/Menu';
import { useRouter } from 'next/navigation';
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

  const router = useRouter();

  const onItemClick = ({ correspondenceId }: CorrespondenceSearchItem) => {
    router.push(`/correspondence?correspondenceId=${correspondenceId}`);
  };

  return (
    <SearchSection<CorrespondenceSearchItem>
      data={correspondences}
      onItemClick={onItemClick}
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
