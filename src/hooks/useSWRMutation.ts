'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Method = 'POST' | 'PUT' | 'DELETE';

interface UseAuthorizedMutationOptions<Body, Response> {
  method?: Method;
  onError?: (error: string) => void;
  onSuccess?: (response: Response) => void;
  token?: string | null;
}

export function useSWRMutation<Body, Response = unknown>(
  path: string,
  options: UseAuthorizedMutationOptions<Body, Response>,
) {
  const { method = 'POST', token = null, onSuccess, onError } = options;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

  const mutate = async (
    body: Body,
    headers: HeadersInit,
  ): Promise<Response | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message);
        onError?.(message);
        return;
      }

      const data = (await res.json()) as Response;

      setResponse(data);
      onSuccess?.(data);

      return data;
    } catch (err: unknown) {
      let message = 'An error occurred!';

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }

      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, mutate, response };
}
