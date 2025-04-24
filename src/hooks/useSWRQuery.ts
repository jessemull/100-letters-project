import useSWR, { SWRConfiguration } from 'swr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface UseSWRQueryOptions {
  path: string | null;
  token: string | null;
  config?: SWRConfiguration;
  skip?: boolean;
}

export function useSWRQuery<T = any>({
  path,
  token,
  config,
  skip = false,
}: UseSWRQueryOptions) {
  const fetcher = token
    ? async (url: string) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        return res.json();
      }
    : null;

  const fullUrl = !skip && token && path ? `${API_BASE_URL}${path}` : null;

  return useSWR<T>(fullUrl, fetcher, config);
}
