'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mutate as globalMutate } from 'swr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Method = 'POST' | 'PUT' | 'DELETE';

interface Cache<Body, Params, Response = unknown> {
  key: string;
  onUpdate?: (args: {
    key: string;
    prev: unknown;
    body?: Body;
    params?: Params;
    response?: Response;
  }) => unknown;
}

interface UseAuthorizedMutationOptions<Body, Response, Params> {
  cache?: Cache<Body, Params, Response>[];
  method?: Method;
  token?: string | null;
  path?: string;
  url?: string;
  onError?: (args: {
    error: string;
    status?: number;
    info?: any;
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
}

interface MutateArgs<Body, Params> {
  path?: string;
  body?: Body;
  params?: Params;
  headers?: HeadersInit;
  url?: string;
}

export function useSWRMutation<Body, Response = unknown, Params = unknown>(
  options: UseAuthorizedMutationOptions<Body, Response, Params>,
) {
  const {
    cache,
    method = 'POST',
    token = null,
    onSuccess,
    onError,
    path: defaultPath,
    url: defaultUrl,
  } = options;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (unauthorized) {
      router.push('/login');
    }
  }, [unauthorized, router]);

  const mutate = useCallback(
    async ({
      path,
      body,
      params,
      headers,
      url,
    }: MutateArgs<Body, Params> = {}): Promise<Response | undefined> => {
      const finalPath = path || defaultPath;
      const finalUrl = url || defaultUrl;

      if (!finalPath) {
        const message = 'Path must be provided either in mutate() or options.';
        setError(message);
        onError?.({ error: message, path: '', body, params });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          finalUrl ? finalUrl : `${API_BASE_URL}${finalPath}`,
          {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
              ...headers,
            },
            body:
              typeof body === 'string' ||
              body instanceof Blob ||
              body instanceof ArrayBuffer
                ? body
                : body
                  ? JSON.stringify(body)
                  : undefined,
          },
        );

        if (!res.ok) {
          let errorBody: any = null;
          let errorMessage = res.statusText || 'Unknown error';

          try {
            errorBody = await res.json();
            errorMessage = errorBody?.message || errorMessage;
          } catch {
            errorBody = await res.text();
            errorMessage =
              typeof errorBody === 'string' ? errorBody : errorMessage;
          }

          if (res.status === 401) {
            setUnauthorized(true);
          }

          setError(errorMessage);
          onError?.({
            error: errorMessage,
            status: res.status,
            info: errorBody,
            path: finalPath,
            body,
            params,
          });

          return;
        }

        let data: Response | undefined = undefined;

        const contentType = res.headers.get('Content-Type') || '';

        if (contentType.includes('application/json')) {
          data = await res.json();
        }

        if (data) {
          setResponse(data);
          onSuccess?.({ response: data, path: finalPath, body, params });

          if (cache && cache.length > 0) {
            cache.forEach(({ key, onUpdate }) => {
              if (onUpdate) {
                globalMutate(
                  `${API_BASE_URL}${key}`,
                  (current: unknown | undefined) =>
                    onUpdate({
                      key,
                      prev: current,
                      body,
                      params,
                      response: data!,
                    }),
                  false,
                );
              }
            });
          }
        }

        return data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'An unexpected error occurred';

        setError(message);
        onError?.({
          error: message,
          path: finalPath,
          body,
          params,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [defaultPath, defaultUrl, cache, method, onError, onSuccess, token],
  );

  return { error, isLoading, mutate, response };
}
