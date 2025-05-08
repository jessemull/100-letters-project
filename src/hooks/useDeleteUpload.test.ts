import { renderHook, act } from '@testing-library/react';
import { useDeleteUpload } from '@hooks/useDeleteUpload';
import { Letter } from '@ts-types/letter';

jest.mock('@util/letter', () => ({
  formatLetterDates: jest.fn((letter) => letter),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn(),
}));

const mockDeleteUpload = jest.fn();
const mockUpdateLetter = jest.fn();

import { useSWRMutation as mockUseSWRMutation } from '@hooks/useSWRMutation';

beforeEach(() => {
  jest.clearAllMocks();

  (mockUseSWRMutation as jest.Mock).mockImplementation(({ method }) => {
    if (method === 'DELETE') {
      return { mutate: mockDeleteUpload };
    } else if (method === 'PUT') {
      return { mutate: mockUpdateLetter };
    }
  });
});

describe('useDeleteUpload', () => {
  const letter: Letter = {
    letterId: '123',
    correspondenceId: 'abc',
    imageURLs: [
      { id: 'img-1', fileKey: 'key-1' },
      { id: 'img-2', fileKey: 'key-2' },
    ],
  } as any;

  it('Successfully deletes an image and updates letter.', async () => {
    mockDeleteUpload.mockResolvedValue({});
    mockUpdateLetter.mockResolvedValue({
      message: 'Success!',
    });

    const { result } = renderHook(() =>
      useDeleteUpload({ letter, token: 'test-token' }),
    );

    await act(async () => {
      const response = await result.current.deleteFile({ imageId: 'img-1' });
      expect(response?.message).toBe('Success!');
      expect(response?.imageURLs).toHaveLength(1);
    });

    expect(mockDeleteUpload).toHaveBeenCalledWith({
      path: '/uploads?fileKey=key-1',
    });

    expect(mockUpdateLetter).toHaveBeenCalledWith({
      body: expect.objectContaining({
        imageURLs: [{ id: 'img-2', fileKey: 'key-2' }],
      }),
      params: { correspondenceId: 'abc', letterId: '123' },
    });
  });

  it('Handles error if upload deletion fails.', async () => {
    mockDeleteUpload.mockRejectedValue(new Error('Failed to delete'));

    const { result } = renderHook(() =>
      useDeleteUpload({ letter, token: 'test-token' }),
    );

    await act(async () => {
      await result.current.deleteFile({ imageId: 'img-1' });
    });

    expect(result.current.error).toBe('Failed to delete');
    expect(result.current.isDeleting).toBe(false);
  });

  it('Handles string error gracefully.', async () => {
    mockDeleteUpload.mockRejectedValue('simple error string');

    const { result } = renderHook(() =>
      useDeleteUpload({ letter, token: 'test-token' }),
    );

    await act(async () => {
      await result.current.deleteFile({ imageId: 'img-1' });
    });

    expect(result.current.error).toBe('simple error string');
    expect(result.current.isDeleting).toBe(false);
  });

  it('Throws formatted error from DELETE onError handler.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError }) => {
        if (method === 'DELETE') {
          return {
            mutate: () => {
              onError({ error: 'Delete failed', status: '400' });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useDeleteUpload({ letter, token: 'test-token' }),
    );

    await act(async () => {
      await result.current.deleteFile({ imageId: 'img-1' });
    });

    expect(result.current.error).toBe('400: Delete failed');
  });

  it('Throws formatted error from DELETE onError handler with default status.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError }) => {
        if (method === 'DELETE') {
          return {
            mutate: () => {
              onError({ error: 'Random error!' });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useDeleteUpload({ letter, token: 'test-token' }),
    );

    await act(async () => {
      await result.current.deleteFile({ imageId: 'img-1' });
    });

    expect(result.current.error).toBe('0: Random error!');
  });

  it('Throws formatted error from PUT onError handler.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError }) => {
        if (method === 'DELETE') {
          return {
            mutate: () => Promise.resolve({}),
          };
        }
        if (method === 'PUT') {
          return {
            mutate: () => {
              onError({ error: 'Update failed', status: '500' });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useDeleteUpload({ letter, token: 'test-token' }),
    );

    await act(async () => {
      await result.current.deleteFile({ imageId: 'img-1' });
    });

    expect(result.current.error).toBe('500: Update failed');
  });

  it('Throws formatted error from PUT onError handler with default message.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError, onSuccess }) => {
        if (method === 'DELETE') {
          return {
            mutate: () => {
              onSuccess();
            },
          };
        }
        if (method === 'PUT') {
          return {
            mutate: () => {
              onError({ error: 'Random error!' });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useDeleteUpload({ letter, token: 'test-token' }),
    );

    await act(async () => {
      await result.current.deleteFile({ imageId: 'img-1' });
    });

    expect(result.current.error).toBe('0: Random error!');
  });
});
