import { Letter, View } from '@ts-types/letter';
import { renderHook, act } from '@testing-library/react';
import { useFileUpload } from '@hooks/useFileUpload';
import { useSWRMutation as mockUseSWRMutation } from '@hooks/useSWRMutation';

jest.mock('@util/letter', () => ({
  formatLetterDates: jest.fn((letter) => letter),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn(),
}));

const mockGetSignedURL = jest.fn();
const mockFileUpload = jest.fn();
const mockUpdateLetter = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (mockUseSWRMutation as jest.Mock).mockImplementation(
    ({ method, onSuccess, path }) => {
      if (method === 'POST') {
        return {
          mutate: mockGetSignedURL.mockImplementation(async () => {
            onSuccess?.();
            return {
              data: {
                dateUploaded: '2025-01-01T00:00:00Z',
                fileKey: 'file-key',
                imageURL: 'https://image.url',
                signedUrl: 'https://signed.url',
                uuid: 'image-id',
                thumbnailURL: 'https://image.thumb',
                uploadedBy: 'user-id',
              },
            };
          }),
        };
      } else if (method === 'PUT' && path?.includes('letter')) {
        return {
          mutate: mockUpdateLetter.mockImplementation(async () => ({
            message: 'Letter updated!',
          })),
        };
      } else if (method === 'PUT') {
        return {
          mutate: mockFileUpload.mockImplementation(async () => {
            onSuccess?.();
            return {};
          }),
        };
      }
      return { mutate: jest.fn() };
    },
  );
});

describe('useFileUpload', () => {
  const baseLetter: Letter = {
    letterId: '123',
    correspondenceId: 'abc',
    imageURLs: [],
  } as any;

  const file = new Blob(['dummy content'], { type: 'image/png' });
  Object.defineProperty(file, 'size', { value: 1234 });

  it('Successfully uploads a file.', async () => {
    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
        caption: 'A caption',
      }),
    );

    let response: any;
    await act(async () => {
      response = await result.current.uploadFile({ file });
    });

    expect(response?.message).toBe('Letter updated!');
    expect(response?.imageURL.caption).toBe('A caption');
    expect(mockGetSignedURL).toHaveBeenCalled();
    expect(mockFileUpload).toHaveBeenCalled();
    expect(mockUpdateLetter).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          imageURLs: [
            expect.objectContaining({
              caption: 'A caption',
              mimeType: 'image/png',
              sizeInBytes: 1234,
              url: 'https://image.url',
              urlThumbnail: 'https://image.thumb',
            }),
          ],
        }),
      }),
    );
  });

  it('Uses undefined caption if not provided.', async () => {
    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    let response: any;
    await act(async () => {
      response = await result.current.uploadFile({ file });
    });

    expect(response?.imageURL.caption).toBeUndefined();
  });

  it('Handles Error instance.', async () => {
    mockGetSignedURL.mockRejectedValueOnce(new Error('Boom!'));

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('Boom!');
    expect(result.current.isUploading).toBe(false);
  });

  it('Handles string error.', async () => {
    mockGetSignedURL.mockRejectedValueOnce('Something broke');

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('Something broke');
  });

  it('Throws formatted error from POST onError handler.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError }) => {
        if (method === 'POST') {
          return {
            mutate: async () => {
              await act(() => {
                onError?.({ error: 'post failed', status: '403' });
              });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('403: post failed');
  });

  it('Throws formatted error from POST onError handler with default status.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError }) => {
        if (method === 'POST') {
          return {
            mutate: async () => {
              await act(() => {
                onError?.({ error: 'post failed' });
              });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('0: post failed');
  });

  it('Throws formatted error from PUT onError handler.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError, onSuccess, path }) => {
        if (method === 'POST') {
          return {
            mutate: mockGetSignedURL.mockImplementation(async () => {
              onSuccess?.();
              return {
                data: {
                  dateUploaded: '2025-01-01T00:00:00Z',
                  fileKey: 'file-key',
                  imageURL: 'https://image.url',
                  signedUrl: 'https://signed.url',
                  uuid: 'image-id',
                  thumbnailURL: 'https://image.thumb',
                  uploadedBy: 'user-id',
                },
              };
            }),
          };
        } else if (method === 'PUT' && path?.includes('letter')) {
          return {
            mutate: async () => {
              await act(() => {
                onError?.({ error: 'put failed', status: '503' });
              });
            },
          };
        } else if (method === 'PUT') {
          return {
            mutate: mockFileUpload.mockImplementation(async () => ({})),
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('503: put failed');
  });

  it('Throws formatted error from PUT onError handler with default status.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError, onSuccess, path }) => {
        if (method === 'POST') {
          return {
            mutate: mockGetSignedURL.mockImplementation(async () => {
              onSuccess?.();
              return {
                data: {
                  dateUploaded: '2025-01-01T00:00:00Z',
                  fileKey: 'file-key',
                  imageURL: 'https://image.url',
                  signedUrl: 'https://signed.url',
                  uuid: 'image-id',
                  thumbnailURL: 'https://image.thumb',
                  uploadedBy: 'user-id',
                },
              };
            }),
          };
        } else if (method === 'PUT' && path?.includes('letter')) {
          return {
            mutate: async () => {
              await act(() => {
                onError?.({ error: 'put failed' });
              });
            },
          };
        } else if (method === 'PUT') {
          return {
            mutate: mockFileUpload.mockImplementation(async () => ({})),
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('0: put failed');
  });

  it('Throws formatted error from PUT letter onError handler.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError, onSuccess }) => {
        if (method === 'POST') {
          return {
            mutate: mockGetSignedURL.mockImplementation(async () => {
              onSuccess?.();
              return {
                data: {
                  dateUploaded: '2025-01-01T00:00:00Z',
                  fileKey: 'file-key',
                  imageURL: 'https://image.url',
                  signedUrl: 'https://signed.url',
                  uuid: 'image-id',
                  thumbnailURL: 'https://image.thumb',
                  uploadedBy: 'user-id',
                },
              };
            }),
          };
        } else if (method === 'PUT') {
          return {
            mutate: async () => {
              await act(() => {
                onError?.({ error: 'put failed', status: '503' });
              });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('503: put failed');
  });

  it('Throws formatted error from PUT letter onError handler with default status.', async () => {
    (mockUseSWRMutation as jest.Mock).mockImplementation(
      ({ method, onError, onSuccess }) => {
        if (method === 'POST') {
          return {
            mutate: mockGetSignedURL.mockImplementation(async () => {
              onSuccess?.();
              return {
                data: {
                  dateUploaded: '2025-01-01T00:00:00Z',
                  fileKey: 'file-key',
                  imageURL: 'https://image.url',
                  signedUrl: 'https://signed.url',
                  uuid: 'image-id',
                  thumbnailURL: 'https://image.thumb',
                  uploadedBy: 'user-id',
                },
              };
            }),
          };
        } else if (method === 'PUT') {
          return {
            mutate: async () => {
              await act(() => {
                onError?.({ error: 'put failed' });
              });
            },
          };
        }
        return { mutate: jest.fn() };
      },
    );

    const { result } = renderHook(() =>
      useFileUpload({
        letter: baseLetter,
        token: 'token',
        view: View.ENVELOPE_BACK,
      }),
    );

    await act(async () => {
      await result.current.uploadFile({ file });
    });

    expect(result.current.error).toBe('0: put failed');
  });
});
