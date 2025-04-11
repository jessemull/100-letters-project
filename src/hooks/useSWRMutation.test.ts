import { renderHook, act } from '@testing-library/react';
import { useSWRMutation } from './useSWRMutation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('useSWRMutation', () => {
  const path = '/test';
  const fullUrl = `${API_BASE_URL}${path}`;
  const body = { key: 'value' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Sends request and sets response on success.', async () => {
    const mockResponse = { success: true };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useSWRMutation<typeof body, typeof mockResponse>(path, { onSuccess }),
    );

    await act(async () => {
      const res = await result.current.mutate(body);
      expect(res).toEqual(mockResponse);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      fullUrl,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.response).toEqual(mockResponse);
    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
  });

  it('Handles API error response.', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: jest.fn().mockResolvedValue('Bad Request'),
    });
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useSWRMutation<typeof body>(path, { onError }),
    );

    await act(async () => {
      const res = await result.current.mutate(body);
      expect(res).toBeUndefined();
    });

    expect(result.current.error).toBe('Bad Request');
    expect(result.current.loading).toBe(false);
    expect(onError).toHaveBeenCalledWith('Bad Request');
  });

  it('Handles fetch throw with Error object.', async () => {
    const errorMessage = 'Network error';
    global.fetch = jest.fn().mockRejectedValue(new Error(errorMessage));
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useSWRMutation<typeof body>(path, { onError }),
    );

    await act(async () => {
      await result.current.mutate(body);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(onError).toHaveBeenCalledWith(errorMessage);
  });

  it('Handles fetch throw with string error.', async () => {
    global.fetch = jest.fn().mockRejectedValue('Something went wrong');
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useSWRMutation<typeof body>(path, { onError }),
    );

    await act(async () => {
      await result.current.mutate(body);
    });

    expect(result.current.error).toBe('Something went wrong');
    expect(onError).toHaveBeenCalledWith('Something went wrong');
  });

  it('Includes authorization header when token is provided.', async () => {
    const token = 'fake-token';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() =>
      useSWRMutation<typeof body>(path, { token }),
    );

    await act(async () => {
      await result.current.mutate(body);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      fullUrl,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      }),
    );
  });
});
