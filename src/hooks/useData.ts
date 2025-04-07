import { Letter, LetterResponse } from 'src/types';
import { fetchWithAuth } from '../util';
import { useEffect, useState } from 'react';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UseData {
  lastEvaluatedKey?: string;
  limit?: number;
  token: string | null;
  route: string;
  skip?: boolean;
}

export function useData({
  lastEvaluatedKey,
  limit = 25,
  token,
  route,
  skip = false,
}: UseData) {
  const [data, setData] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (skip || !token || loading) return;

    const fetchData = async () => {
      setLoading(true);

      const params = new URLSearchParams();

      if (lastEvaluatedKey) {
        params.append('lastEvaluatedKey', lastEvaluatedKey);
      }

      if (limit) {
        params.append('limit', limit.toString());
      }

      const url = `${NEXT_PUBLIC_API_URL}${route}?${params.toString()}`;

      try {
        const response = await fetchWithAuth<LetterResponse>({
          options: {},
          url,
          token,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lastEvaluatedKey, limit, loading, route, token, skip]);

  return { data, loading, error };
}
