import useSWR, { SWRConfiguration } from 'swr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useSWRWithAuth<T = any>(
  path: string | null,
  token: string | null,
  config?: SWRConfiguration,
) {
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

  const fullUrl = token && path ? `${API_BASE_URL}${path}` : null;

  return useSWR<T>(fullUrl, fetcher, config);
}
