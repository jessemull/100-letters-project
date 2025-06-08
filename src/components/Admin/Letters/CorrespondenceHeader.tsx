'use client';

import { Skeleton } from '@components/Skeleton';

interface Props {
  label: string | null;
}

const CorrespondenceHeader: React.FC<Props> = ({ label }) => {
  if (!label) {
    return (
      <div className="flex space-x-2 mt-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-48" />
      </div>
    );
  }
  return <h3 className="text-white text-lg mt-2">{label}</h3>;
};

export default CorrespondenceHeader;
