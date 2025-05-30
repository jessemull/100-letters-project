import { renderHook, act } from '@testing-library/react';
import { useSWRMutation } from '@hooks/useSWRMutation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockMutateResponse = {
  data: 'mocked data',
};

describe('useSWRMutation', () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const createMockResponse = ({
    ok,
    status = 200,
    json,
    text,
    headers = { get: () => 'application/json' },
  }: {
    ok: boolean;
    status?: number;
    json?: () => Promise<any>;
    text?: () => Promise<string>;
    headers?: { get: (key: string) => string | null };
  }) => ({
    ok,
    status,
    json: json || (async () => ({})),
    text: text || (async () => ''),
    headers,
  });

  it('Initializes with correct state and calls mutate.', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onSuccess,
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: true,
        json: async () => mockMutateResponse,
      }),
    );

    await act(async () => {
      await result.current.mutate({
        path: '/mock-path',
        body: { key: 'value' },
      });
    });

    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/mock-path`,
      expect.objectContaining({
        method: 'POST',
        body: '{"key":"value"}',
      }),
    );

    await Promise.resolve();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.response).toEqual(mockMutateResponse);
    expect(onSuccess).toHaveBeenCalledWith({
      response: mockMutateResponse,
      path: '/mock-path',
      body: { key: 'value' },
      params: undefined,
    });
  });

  it('Handles error from fetch correctly.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    const errorResponse = { message: 'Some error occurred' };
    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        json: async () => errorResponse,
      }),
    );

    await act(async () => {
      await result.current.mutate({
        path: '/mock-path',
        body: { key: 'value' },
      });
    });

    await Promise.resolve();
    expect(result.current.error).toBe(errorResponse.message);
    expect(onError).toHaveBeenCalledWith({
      body: {
        key: 'value',
      },
      error: 'Some error occurred',
      info: {
        message: 'Some error occurred',
      },
      params: undefined,
      path: '/mock-path',
      status: 200,
    });
  });

  it('Handles fetch failure gracefully.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await result.current.mutate({
        path: '/mock-path',
        body: { key: 'value' },
      });
    });

    await Promise.resolve();

    expect(result.current.error).toBe('Network error');
    expect(onError).toHaveBeenCalledWith({
      error: 'Network error',
      path: '/mock-path',
      body: { key: 'value' },
      params: undefined,
    });
  });

  it('Calls onUpdate with mutate if provided.', async () => {
    const onUpdate = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        cache: [{ key: '/mock-key', onUpdate }],
      }),
    );

    const response = { data: 'updated data' };
    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: true,
        json: async () => response,
      }),
    );

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
    });

    await Promise.resolve();

    expect(onUpdate).toHaveBeenCalledWith({
      key: '/mock-key',
      prev: undefined,
      body: undefined,
      params: undefined,
      response: {
        data: 'updated data',
      },
    });
  });

  it('Calls onSuccess if provided on success.', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onSuccess,
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: true,
        json: async () => mockMutateResponse,
      }),
    );

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
    });

    await Promise.resolve();

    expect(onSuccess).toHaveBeenCalledWith({
      response: mockMutateResponse,
      path: '/mock-path',
      body: undefined,
      params: undefined,
    });
  });

  it('Handles missing path by calling onError and setting error state.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        onError,
      }),
    );

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.error).toBe(
      'Path must be provided either in mutate() or options.',
    );
    expect(onError).toHaveBeenCalledWith({
      error: 'Path must be provided either in mutate() or options.',
      path: '',
      body: undefined,
      params: undefined,
    });
  });

  it('Uses finalUrl when provided.', async () => {
    const customUrl = 'https://custom.api.com/custom-path';
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ ok: true, json: async () => mockMutateResponse }),
    );

    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/fallback-path',
      }),
    );

    await act(async () => {
      await result.current.mutate({ url: customUrl, body: { key: 'value' } });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      customUrl,
      expect.objectContaining({
        method: 'POST',
        body: '{"key":"value"}',
      }),
    );
  });

  it('Includes Authorization header when token is provided.', async () => {
    const token = 'mock-token';

    mockFetch.mockResolvedValueOnce(
      createMockResponse({ ok: true, json: async () => mockMutateResponse }),
    );

    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        token,
      }),
    );

    await act(async () => {
      await result.current.mutate({ body: { key: 'value' } });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      }),
    );
  });

  it('Sends ArrayBuffer body as-is without stringifying.', async () => {
    const buffer = new ArrayBuffer(8);

    mockFetch.mockResolvedValueOnce(
      createMockResponse({ ok: true, json: async () => mockMutateResponse }),
    );

    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
      }),
    );

    await act(async () => {
      await result.current.mutate({ body: buffer });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/mock-path`,
      expect.objectContaining({
        body: buffer,
      }),
    );
  });

  it('Falls back to res.text() when res.json() throws.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        text: async () => 'Plain text error',
      }),
    );

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
    });

    expect(result.current.error).toBe('Plain text error');
    expect(onError).toHaveBeenCalledWith({
      error: 'Plain text error',
      status: 200,
      info: 'Plain text error',
      path: '/mock-path',
      body: undefined,
      params: undefined,
    });
  });

  it('Uses statusText if errorBody.message is undefined.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        status: 400,
        json: async () => ({}),
      }),
    );

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
    });

    expect(result.current.error).toBe('Unknown error');
    expect(onError).toHaveBeenCalledWith({
      error: 'Unknown error',
      status: 400,
      info: {},
      path: '/mock-path',
      body: undefined,
      params: undefined,
    });
  });

  it('Defaults to POST method when none is provided.', async () => {
    const { result } = renderHook(() =>
      useSWRMutation({
        path: '/default-method',
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: true,
        json: async () => mockMutateResponse,
      }),
    );

    await act(async () => {
      await result.current.mutate({
        path: '/default-method',
        body: { key: 'value' },
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/default-method'),
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('Sets unauthorized and redirects to /login on 401 response.', async () => {
    const mockPush = jest.fn();

    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }));

    const useRouter = require('next/navigation').useRouter;
    useRouter.mockReturnValue({ push: mockPush });

    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError: jest.fn(),
      }),
    );

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ message: 'Unauthorized access' }),
      text: async () => 'Unauthorized access',
      headers: { get: () => 'application/json' },
    });

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
    });

    await Promise.resolve();

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(result.current.error).toBe('Unauthorized access');
  });

  it('Falls back to res.text() and uses string error message if res.json fails.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        path: '/text-fallback',
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        json: async () => {
          throw new Error('JSON parse error');
        },
        text: async () => 'Raw string error from server',
      }),
    );

    await act(async () => {
      await result.current.mutate({ path: '/text-fallback' });
    });

    expect(result.current.error).toBe('Raw string error from server');
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Raw string error from server',
      }),
    );
  });

  it('Defaults to empty string when Content-Type header is missing.', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        path: '/missing-content-type',
        onSuccess,
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: true,
        headers: { get: () => null },
        json: async () => mockMutateResponse,
      }),
    );

    await act(async () => {
      await result.current.mutate({ path: '/missing-content-type' });
    });

    expect(result.current.response).toBeNull();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('Handles string thrown error instead of Error instance.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        path: '/string-error',
        onError,
      }),
    );

    mockFetch.mockImplementationOnce(() => {
      throw 'This is a string error';
    });

    await act(async () => {
      await result.current.mutate({ path: '/string-error' });
    });

    expect(result.current.error).toBe('This is a string error');
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'This is a string error',
      }),
    );
  });

  it('Sets generic error message when thrown error is not an Error or string.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockRejectedValueOnce(null);

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.error).toBe('An unexpected error occurred');
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'An unexpected error occurred' }),
    );
  });

  it('Handles non-string fallback error body gracefully.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
        text: async () => ({ not: 'a string' }) as any,
      }),
    );

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.error).toBe('Unknown error');
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Unknown error' }),
    );
  });
});
