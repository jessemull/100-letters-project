import { renderHook, act } from '@testing-library/react';
import { useSWRMutation } from '@hooks/useSWRMutation';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockMutateResponse = {
  data: 'mocked data',
};

describe('useSWRMutation', () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMutateResponse,
    });

    await act(async () => {
      result.current.mutate({ path: '/mock-path', body: { key: 'value' } });
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
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => errorResponse,
    });

    await act(async () => {
      result.current.mutate({ path: '/mock-path', body: { key: 'value' } });
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
      status: undefined,
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
      result.current.mutate({ path: '/mock-path', body: { key: 'value' } });
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
        key: '/mock-key',
        onUpdate,
      }),
    );

    const response = { data: 'updated data' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => response,
    });

    await act(async () => {
      result.current.mutate({ path: '/mock-path' });
    });

    await Promise.resolve();

    expect(onUpdate).toHaveBeenCalledWith({
      prev: undefined,
      body: undefined,
      params: undefined,
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMutateResponse,
    });

    await act(async () => {
      result.current.mutate({ path: '/mock-path' });
    });

    await Promise.resolve();

    expect(onSuccess).toHaveBeenCalledWith({
      response: mockMutateResponse,
      path: '/mock-path',
      body: undefined,
      params: undefined,
    });
  });

  it('Throws an error if path is missing and no defaultPath is provided.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        onError,
      }),
    );

    await act(async () => {
      result.current.mutate({});
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

  it('Handles error parsing when the response body is not JSON.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Non-JSON error message',
    });

    await act(async () => {
      result.current.mutate({ path: '/mock-path', body: { key: 'value' } });
    });

    await Promise.resolve();

    expect(result.current.error).toBe('Non-JSON error message');
    expect(onError).toHaveBeenCalledWith({
      body: {
        key: 'value',
      },
      error: 'Non-JSON error message',
      info: 'Non-JSON error message',
      params: undefined,
      path: '/mock-path',
      status: undefined,
    });
  });

  it('Adds Authorization header when token is provided.', async () => {
    const token = 'test-token';
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        token,
      }),
    );

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMutateResponse,
    });

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
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

  it('Falls back to default "Unknown error" if no message in error response.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
    });

    expect(result.current.error).toBe('Unknown error');
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Unknown error',
      }),
    );
  });

  it('Handles thrown string errors in catch block.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockImplementationOnce(() => {
      throw 'Custom string error';
    });

    await act(async () => {
      await result.current.mutate({ path: '/mock-path' });
    });

    expect(result.current.error).toBe('Custom string error');
    expect(onError).toHaveBeenCalledWith({
      error: 'Custom string error',
      path: '/mock-path',
      body: undefined,
      params: undefined,
    });
  });

  it('Uses default POST method when none is specified.', async () => {
    const { result } = renderHook(() =>
      useSWRMutation({
        path: '/default-method',
      }),
    );

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMutateResponse,
    });

    await act(async () => {
      await result.current.mutate({
        path: '/default-method',
        body: { hello: 'world' },
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/default-method`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ hello: 'world' }),
      }),
    );
  });

  it('Calls mutate() with no arguments and triggers missing path error.', async () => {
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useSWRMutation({
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

  it('Falls back to generic error message if error has no message.', async () => {
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useSWRMutation({
        path: '/trigger-error',
        onError,
      }),
    );

    mockFetch.mockImplementationOnce(() => {
      throw {};
    });

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.error).toBe('An unexpected error occurred');
    expect(onError).toHaveBeenCalledWith({
      error: 'An unexpected error occurred',
      path: '/trigger-error',
      body: undefined,
      params: undefined,
    });
  });

  it('Falls back to statusText when response.text() returns non-string.', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useSWRMutation({
        method: 'POST',
        path: '/mock-path',
        onError,
      }),
    );

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error('Invalid JSON');
      },
      text: async () => ({ unexpected: 'object' }),
      statusText: 'Internal Server Error',
      status: 500,
    });

    await act(async () => {
      result.current.mutate({ path: '/mock-path', body: { key: 'value' } });
    });

    await Promise.resolve();

    expect(result.current.error).toBe('Internal Server Error');
    expect(onError).toHaveBeenCalledWith({
      body: { key: 'value' },
      error: 'Internal Server Error',
      info: { unexpected: 'object' },
      params: undefined,
      path: '/mock-path',
      status: 500,
    });
  });
});
