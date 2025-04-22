'use client';

import { useState, useCallback } from 'react';
import { mutate as globalMutate } from 'swr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Method = 'POST' | 'PUT' | 'DELETE';

interface UseAuthorizedMutationOptions<Body, Response, CacheType, Params> {
  key?: string;
  method?: Method;
  token?: string | null;
  path?: string;
  onError?: (args: {
    error: string;
    path: string;
    body?: Body;
    params?: Params;
  }) => void;
  onSuccess?: (args: {
    response: Response;
    path: string;
    body?: Body;
    params?: Params;
  }) => void;
  onUpdate?: (args: {
    prev: CacheType | undefined;
    body?: Body;
    params?: Params;
  }) => CacheType;
}

interface MutateArgs<Body, Params> {
  path?: string;
  body?: Body;
  params?: Params;
  headers?: HeadersInit;
}

export function useSWRMutation<
  Body,
  Response = unknown,
  CacheType = unknown,
  Params = unknown,
>(options: UseAuthorizedMutationOptions<Body, Response, CacheType, Params>) {
  const {
    method = 'POST',
    token = null,
    onSuccess,
    onError,
    key,
    onUpdate,
    path: defaultPath,
  } = options;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

  const mutate = useCallback(
    async ({
      path,
      body,
      params,
      headers,
    }: MutateArgs<Body, Params> = {}): Promise<Response | undefined> => {
      const finalPath = path || defaultPath;

      if (!finalPath) {
        const message = 'Path must be provided either in mutate() or options.';
        setError(message);
        onError?.({ error: message, path: '', body, params });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}${finalPath}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });

        if (!res.ok) {
          let errorMsg = 'Unknown error';
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorMsg;
          } catch {
            errorMsg = await res.text();
          }

          setError(errorMsg);
          onError?.({ error: errorMsg, path: finalPath, body, params });
          return;
        }

        const data: Response = await res.json();
        setResponse(data);
        onSuccess?.({ response: data, path: finalPath, body, params });

        if (key && onUpdate) {
          globalMutate(
            `${API_BASE_URL}${key}`,
            (current: CacheType | undefined) =>
              onUpdate({ prev: current, body, params }),
            false,
          );
        }

        return data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'An error occurred!';
        setError(message);
        onError?.({ error: message, path: finalPath, body, params });
      } finally {
        setIsLoading(false);
      }
    },
    [defaultPath, key, method, onError, onSuccess, onUpdate, token],
  );

  return { error, isLoading, mutate, response };
}
