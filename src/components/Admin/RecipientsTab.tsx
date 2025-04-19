'use client';

import React from 'react';
import { GetRecipientsResponse } from '@ts-types/recipients';
import { Progress } from '@components/Form';
import { RecipientItem } from '@components/Admin';
import { useSWRQuery } from '@hooks/useSWRQuery';

interface Props {
  token: string | null;
}

const RecipientsTab: React.FC<Props> = ({ token }) => {
  const { data, isLoading } = useSWRQuery<GetRecipientsResponse>(
    '/recipient',
    token,
  );
  return isLoading ? (
    <div className="w-full flex-grow flex items-center justify-center py-24 min-h-[calc(100vh-475px)]">
      <Progress color="white" size={16} />
    </div>
  ) : (
    <ul className="grid gap-4">
      {data?.data.map((item, idx) => (
        <li key={idx}>
          <RecipientItem data={item} />
        </li>
      ))}
      {data?.data.length === 0 && (
        <li className="text-center text-gray-500">No results found.</li>
      )}
    </ul>
  );
};

export default RecipientsTab;
