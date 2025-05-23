'use client';

import { useSearchParams } from 'next/navigation';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useMemo } from 'react';
import { CorrespondenceNavigator } from '@components/CorrespondenceNavigator';

const CorrespondenceNavigatorHOC = () => {
  const { correspondencesById } = useCorrespondence();
  const searchParams = useSearchParams();
  const correspondenceId = searchParams.get('correspondenceId');

  const correspondence = useMemo(() => {
    if (!correspondenceId) return null;
    return correspondencesById[correspondenceId];
  }, [correspondenceId, correspondencesById]);

  if (!correspondence) {
    return (
      <div className="text-white p-8 text-center">
        Correspondence not found.
      </div>
    );
  }

  return (
    <div className="text-white px-4 py-8 max-w-6xl mx-auto space-y-8">
      <CorrespondenceNavigator correspondence={correspondence} />
    </div>
  );
};

export default CorrespondenceNavigatorHOC;
