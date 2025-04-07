interface FetchWithAuth {
  options: RequestInit;
  token: string;
  url: string;
}

export async function fetchWithAuth<T>({
  options = {},
  token,
  url,
}: FetchWithAuth): Promise<T> {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
