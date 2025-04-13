import useSWR from 'swr';
import { renderHook } from '@testing-library/react';
import { useSWRQuery } from '@hooks/useSWRQuery';

jest.mock('swr');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('useSWRQuery', () => {
  const mockUseSWR = useSWR as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Returns null URL and fetcher if token is null.', () => {
    useSWRQuery('/some-path', null);

    expect(mockUseSWR).toHaveBeenCalledWith(null, null, undefined);
  });

  it('Returns null URL and a defined fetcher if path is null but token is present.', () => {
    useSWRQuery(null, 'fake-token');

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

    mockUseSWR.mockImplementation((url, fetcher, config) => {
      capturedFetcher = fetcher;
      return { data: null, isLoading: true };
    });

    const { result } = renderHook(() => useSWRQuery('/test', 'abc123'));

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

    mockUseSWR.mockImplementation((url, fetcher, config) => {
      capturedFetcher = fetcher;
      return { data: null, isLoading: true };
    });

    renderHook(() => useSWRQuery('/unauthorized', 'abc123'));

    if (capturedFetcher) {
      await expect(
        (capturedFetcher as jest.Mock)(`${API_BASE_URL}/unauthorized`),
      ).rejects.toThrow('Error 403: Forbidden');
    }
  });

  it('Passes through custom SWR configuration.', () => {
    const config = { revalidateOnFocus: false };
    useSWRQuery('/custom', 'abc123', config);

    expect(mockUseSWR).toHaveBeenCalledWith(
      `${API_BASE_URL}/custom`,
      expect.any(Function),
      config,
    );
  });
});
