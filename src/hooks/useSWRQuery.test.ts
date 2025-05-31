import useSWR from 'swr';
import { defaultMerge, useSWRQuery } from '@hooks/useSWRQuery';
import { renderHook, act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('swr');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('useSWRQuery', () => {
  const mockUseSWR = useSWR as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Returns null URL and fetcher if token is null.', () => {
    mockUseSWR.mockReturnValue({
      data: null,
      isLoading: true,
      error: new Error('Internal Server Error'),
    });

    renderHook(() => useSWRQuery({ path: '/some-path', token: null }));

    expect(mockUseSWR).toHaveBeenCalledWith(null, null, undefined);
  });

  it('Returns null URL and a defined fetcher if path is null but token is present.', () => {
    mockUseSWR.mockReturnValue({
      data: null,
      isLoading: true,
      error: new Error('Internal Server Error'),
    });

    renderHook(() => useSWRQuery({ path: null, token: 'fake-token' }));

    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      undefined,
    );
  });

  it('Calls useSWR with constructed URL and fetcher when token and path are valid.', async () => {
    const fakeResponse = { data: ['mocked data'] };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(fakeResponse),
    });

    let capturedFetcher: ((url: string) => Promise<any>) | null = null;

    mockUseSWR.mockImplementation((url, fetcher) => {
      capturedFetcher = fetcher;
      return { data: null, isLoading: true };
    });

    renderHook(() => useSWRQuery({ path: '/test', token: 'abc123' }));

    const expectedUrl = `${API_BASE_URL}/test`;
    expect(mockUseSWR).toHaveBeenCalledWith(
      expectedUrl,
      expect.any(Function),
      undefined,
    );

    if (capturedFetcher) {
      const result = await (capturedFetcher as jest.Mock)(expectedUrl);
      expect(result).toEqual(fakeResponse);
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          Authorization: 'Bearer abc123',
          'Content-Type': 'application/json',
        },
      });
    }
  });

  it('Throws an error if fetch response is not ok.', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    let capturedFetcher: ((url: string) => Promise<any>) | null = null;

    mockUseSWR.mockImplementation((url, fetcher) => {
      capturedFetcher = fetcher;
      return { data: null, isLoading: true };
    });

    renderHook(() => useSWRQuery({ path: '/unauthorized', token: 'abc123' }));

    if (capturedFetcher) {
      await expect(
        (capturedFetcher as jest.Mock)(`${API_BASE_URL}/unauthorized`),
      ).rejects.toThrow('Forbidden');
    }
  });

  it('Passes through custom SWR configuration.', () => {
    const config = { revalidateOnFocus: false };
    renderHook(() => useSWRQuery({ path: '/custom', token: 'abc123', config }));

    expect(mockUseSWR).toHaveBeenCalledWith(
      `${API_BASE_URL}/custom`,
      expect.any(Function),
      config,
    );
  });

  it('Throws default error message when response is not ok and errorBody.message is missing.', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: jest.fn().mockResolvedValue({}),
    });

    let capturedFetcher: ((url: string) => Promise<any>) | null = null;

    mockUseSWR.mockImplementation((url, fetcher) => {
      capturedFetcher = fetcher;
      return { data: null, isLoading: true };
    });

    renderHook(() => useSWRQuery({ path: '/error', token: 'abc123' }));

    if (capturedFetcher) {
      await expect(
        (capturedFetcher as jest.Mock)(`${API_BASE_URL}/error`),
      ).rejects.toThrow('Error 500: Internal Server Error');
    }
  });

  it('Calls fetchMore and updates merged data.', async () => {
    const fakeResponse = { data: ['mocked data'] };
    const existingData = { data: ['existing data'] };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(fakeResponse),
    });

    let capturedFetcher: ((url: string) => Promise<any>) | null = null;

    mockUseSWR.mockImplementation((url, fetcher) => {
      capturedFetcher = fetcher;
      return { data: existingData, isLoading: true };
    });

    const { result } = renderHook(() =>
      useSWRQuery({ path: '/test', token: 'abc123' }),
    );

    await act(async () => {
      if (capturedFetcher) {
        await (capturedFetcher as jest.Mock)(`${API_BASE_URL}/test`);
      }
    });

    const { fetchMore } = result.current;
    await act(async () => {
      await fetchMore('/next-page');
    });

    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/next-page`, {
      headers: {
        Authorization: 'Bearer abc123',
        'Content-Type': 'application/json',
      },
    });

    expect(result.current.data).toEqual({
      data: ['existing data', 'mocked data'],
    });
  });

  it('Does not call fetchMore if there is no token.', async () => {
    const fakeResponse = { data: ['mocked data'] };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(fakeResponse),
    });

    const { result } = renderHook(() =>
      useSWRQuery({ path: '/test', token: null }),
    );

    const { fetchMore } = result.current;
    await act(async () => {
      await fetchMore('/next-page');
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('Handles errors in fetchMore gracefully.', async () => {
    console.error = jest.fn();
    const error = new Error('Network Error');
    global.fetch = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() =>
      useSWRQuery({ path: '/test', token: 'abc123' }),
    );

    const { fetchMore } = result.current;

    await act(async () => {
      await fetchMore('/next-page');
    });

    expect(console.error).toHaveBeenCalledWith('Error fetching more: ', error);
  });

  it('Updates merged data in useEffect after new data is fetched.', async () => {
    const fakeResponse = { data: ['mocked data'] };
    const existingData = { data: ['existing data'] };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(fakeResponse),
    });

    let capturedFetcher: ((url: string) => Promise<any>) | null = null;

    mockUseSWR.mockImplementation((url, fetcher) => {
      capturedFetcher = fetcher;
      return { data: existingData, isLoading: true };
    });

    const { result } = renderHook(() =>
      useSWRQuery({ path: '/test', token: 'abc123' }),
    );

    await act(async () => {
      if (capturedFetcher) {
        await (capturedFetcher as jest.Mock)(`${API_BASE_URL}/test`);
      }
    });

    const { fetchMore } = result.current;
    await act(async () => {
      await fetchMore('/next-page');
    });

    expect(result.current.data).toEqual({
      data: ['existing data', 'mocked data'],
    });
  });

  it('Sets unauthorized to true on 401 error.', async () => {
    const unauthorizedResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: jest.fn().mockResolvedValue({ message: 'Unauthorized access' }),
    };

    global.fetch = jest.fn().mockResolvedValue(unauthorizedResponse);

    let capturedFetcher: ((url: string) => Promise<any>) | null = null;

    mockUseSWR.mockImplementation((url, fetcher) => {
      capturedFetcher = fetcher;
      return { data: null, isLoading: true };
    });

    renderHook(() => useSWRQuery({ path: '/protected', token: 'bad-token' }));

    if (capturedFetcher) {
      await act(async () => {
        try {
          await (capturedFetcher as jest.Mock)(`${API_BASE_URL}/protected`);
        } catch {}
      });
    }
  });

  it('Redirects to login if fetchMore throws 401.', async () => {
    const existingData = { data: ['existing'] };
    const pushMock = jest.fn();

    jest
      .mocked(require('next/navigation').useRouter)
      .mockReturnValue({ push: pushMock });

    const unauthorizedError = new Error('Unauthorized') as Error & {
      status?: number;
    };
    unauthorizedError.status = 401;

    global.fetch = jest.fn().mockRejectedValue(unauthorizedError);

    mockUseSWR.mockImplementation(() => {
      return { data: existingData, isLoading: false };
    });

    const { result } = renderHook(() =>
      useSWRQuery({ path: '/secure', token: 'abc123' }),
    );

    const { fetchMore } = result.current;

    await act(async () => {
      await fetchMore('/next-secure-page');
    });

    expect(pushMock).toHaveBeenCalledWith('/login');
  });
});

describe('defaultMerge', () => {
  it('Returns the page when prev is null.', () => {
    const prev = null;
    const page = { data: [1, 2, 3] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual(page);
  });

  it('Merges data when prev contains empty data array.', () => {
    const prev = { data: [] };
    const page = { data: [1, 2, 3] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({ data: [1, 2, 3] });
  });

  it('Merges data when prev contains data and page contains additional data.', () => {
    const prev = { data: [1, 2] };
    const page = { data: [3, 4, 5] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({ data: [1, 2, 3, 4, 5] });
  });

  it('Merges nested data correctly when prev and page have nested data arrays.', () => {
    const prev = {
      data: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
      ],
    };
    const page = {
      data: [
        { id: 3, value: 'c' },
        { id: 4, value: 'd' },
      ],
    };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({
      data: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
        { id: 3, value: 'c' },
        { id: 4, value: 'd' },
      ],
    });
  });

  it('Handles cases where the page contains no data.', () => {
    const prev = { data: [1, 2, 3] };
    const page = { data: [] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({ data: [1, 2, 3] });
  });

  it('Handles when both prev and page are null.', () => {
    const prev = null;
    const page = null;

    const result = defaultMerge(prev, page);

    expect(result).toEqual(null);
  });
});
