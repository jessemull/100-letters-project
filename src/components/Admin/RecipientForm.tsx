'use client';

import { Progress } from '@components/Form';
import { useAuth } from '@contexts/AuthProvider';
import { useSWRQuery } from '@hooks/useSWRQuery';
import {
  GetRecipientByIdResponse,
  GetRecipientsResponse,
} from '@ts-types/recipients';
import { useSearchParams } from 'next/navigation';

const RecipientForm = () => {
  const searchParams = useSearchParams();
  const recipientId = searchParams.get('recipientId');

  const { loading: authenticating, token } = useAuth();

  const { data: { data } = {}, isLoading } =
    useSWRQuery<GetRecipientByIdResponse>(`/recipient/${recipientId}`, token);

  return isLoading || authenticating ? (
    <Progress />
  ) : (
    <div>Recipient ID: {data?.recipientId}</div>
  );
};

export default RecipientForm;
