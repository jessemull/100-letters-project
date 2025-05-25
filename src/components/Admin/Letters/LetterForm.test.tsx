import { Letter, View } from '@ts-types/letter';
import { LetterForm } from '@components/Admin';
import { LetterImageFactory } from '@factories/letter';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { showToast } from '@components/Form';
import { useAuth } from '@contexts/AuthProvider';
import { useDeleteUpload } from '@hooks/useDeleteUpload';
import { useFileUpload } from '@hooks/useFileUpload';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { act } from 'react';

jest.mock('@contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@hooks/useSWRQuery', () => ({
  useSWRQuery: jest.fn(),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn(),
}));

jest.mock('../../Form/Toast', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@hooks/useDeleteUpload');
jest.mock('@hooks/useFileUpload');

describe('LetterForm', () => {
  const pushMock = jest.fn();
  const backMock = jest.fn();

  const sampleLetter = {
    letterId: 'abc123',
    correspondenceId: 'c1',
    description: 'description',
    imageURLs: [LetterImageFactory.build()],
    method: 'HANDWRITTEN',
    receivedAt: '2023-12-01T08:00:00.000Z',
    sentAt: '2023-12-01T10:00:00.000Z',
    status: 'PENDING',
    text: 'text here',
    title: 'letter title',
    type: 'MAIL',
  };

  const sampleCorrespondence = {
    correspondenceId: 'c1',
    recipient: { firstName: 'Jane', lastName: 'Doe' },
    title: 'Sample Title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      back: backMock,
    });
    (useAuth as jest.Mock).mockReturnValue({
      loading: false,
      token: 'token123',
    });
    (useDeleteUpload as jest.Mock).mockReturnValue({
      deleteFile: jest.fn().mockResolvedValue({ imageURLs: [] }),
      isDeleting: false,
      error: null,
    });
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: jest.fn().mockResolvedValue({ message: 'Success!' }),
      isUploading: false,
      error: null,
    });
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });
  });

  it('Seeds empty form and allows user to create letter.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/correspondence?limit=500') {
        return {
          data: {
            data: [
              {
                correspondenceId: 'c1',
                recipient: { firstName: 'Test', lastName: 'User' },
                title: 'Test Correspondence',
              },
              {
                correspondenceId: 'c2',
                recipient: { firstName: 'Test 2', lastName: 'User 2' },
                title: 'Test Correspondence 2',
              },
            ],
          },
          isLoading: false,
        };
      }
      return {};
    });

    const mutateMock = jest.fn().mockResolvedValue({});
    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onSuccess?.();
        mutateMock({ body });
      },
    }));

    render(<LetterForm />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Letter Text'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'EMAIL' },
    });
    fireEvent.change(screen.getByLabelText('Method'), {
      target: { value: 'DIGITAL' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'SENT' },
    });
    fireEvent.change(screen.getByPlaceholderText('Sent At'), {
      target: { value: '04/25/2025, 2:30 PM' },
    });
    fireEvent.change(screen.getByPlaceholderText('Received At'), {
      target: { value: '04/25/2025, 2:30 PM' },
    });

    const input = screen.getByTestId('correspondenceId');
    fireEvent.focus(input);

    const option = await screen.getByText('User, Test - Test Correspondence');
    fireEvent.click(option);

    fireEvent.click(screen.getByDisplayValue('Create'));

    await waitFor(() => {
      const body = mutateMock.mock.calls[0][0].body;
      expect(body.correspondenceId).toBe('c1');
    });
  });

  it('Loads letter for edit mode using letterId.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'abc123',
    });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/letter/abc123') {
        return {
          data: { data: sampleLetter },
          isLoading: false,
        };
      }
      if (path === '/correspondence/c1') {
        return {
          data: { data: sampleCorrespondence },
          isLoading: false,
        };
      }
      return {};
    });

    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });

    render(<LetterForm />);

    expect(await screen.findByDisplayValue('letter title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('text here')).toBeInTheDocument();
  });

  it('Uses default names and title for edit.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'abc123',
    });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/letter/abc123') {
        return {
          data: { data: sampleLetter },
          isLoading: false,
        };
      }
      if (path === '/correspondence/c1') {
        return {
          data: { data: { correspondenceId: 'c1' } },
          isLoading: false,
        };
      }
      return {};
    });

    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });

    render(<LetterForm />);

    expect(await screen.findByDisplayValue('letter title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('text here')).toBeInTheDocument();
  });

  it('Shows loading state if still fetching.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'abc123',
    });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/letter/abc123') {
        return {
          data: { data: sampleLetter },
          isLoading: false,
        };
      }
      if (path === '/correspondence/c1') {
        return {
          data: { data: { correspondenceId: 'c1' } },
          isLoading: false,
        };
      }
      return {};
    });
    (useAuth as jest.Mock).mockReturnValue({ loading: true });
    render(<LetterForm />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Calls router.back on cancel click.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });
    (useSWRQuery as jest.Mock).mockReturnValue({});
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });

    render(<LetterForm />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(backMock).toHaveBeenCalled();
  });

  it('Shows toast if fetch error occurs.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'abc123' });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/letter/abc123') {
        return {
          error: { info: { message: 'Bad fetch' } },
          isLoading: false,
        };
      }
      return {};
    });

    render(<LetterForm />);

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Bad fetch',
        type: 'error',
      }),
    );
  });

  it('Removes sentAt/receivedAt if empty.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/correspondence?limit=500') {
        return {
          data: {
            data: [
              {
                correspondenceId: 'c1',
                recipient: { firstName: 'Test', lastName: 'User' },
                title: 'Test Correspondence',
              },
            ],
          },
          isLoading: false,
        };
      }
      return {};
    });

    const mutateMock = jest.fn().mockResolvedValue({});
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isLoading: false,
    });

    render(<LetterForm />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Letter Text'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'EMAIL' },
    });
    fireEvent.change(screen.getByLabelText('Method'), {
      target: { value: 'DIGITAL' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'SENT' },
    });

    const input = screen.getByTestId('correspondenceId');
    fireEvent.focus(input);

    const option = await screen.getByText('User, Test - Test Correspondence');
    fireEvent.click(option);

    fireEvent.click(screen.getByDisplayValue('Create'));

    await waitFor(() => {
      const body = mutateMock.mock.calls[0][0].body;
      expect(body.sentAt).toBeUndefined();
      expect(body.receivedAt).toBeUndefined();
      expect(body.correspondenceId).toBe('c1');
    });
  });

  it('Uses default first and last name.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/correspondence?limit=500') {
        return {
          data: {
            data: [
              {
                correspondenceId: 'c1',
              },
            ],
          },
          isLoading: false,
        };
      }
      return {};
    });

    const mutateMock = jest.fn().mockResolvedValue({});
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isLoading: false,
    });

    render(<LetterForm />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Letter Text'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'EMAIL' },
    });
    fireEvent.change(screen.getByLabelText('Method'), {
      target: { value: 'DIGITAL' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'SENT' },
    });

    const input = screen.getByTestId('correspondenceId');
    fireEvent.focus(input);

    expect(
      screen.getByText('No Last Name, No First Name - No Title'),
    ).toBeInTheDocument();
  });

  it('Shows toast if fetch error occurs and shows default message.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => 'abc123' });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/letter/abc123') {
        return {
          data: { data: { correspondenceId: 'c1' } },
          isLoading: false,
        };
      }
      if (path === '/correspondence/c1') {
        return {
          error: { info: {} },
          isLoading: false,
        };
      }
      return {};
    });

    const mutateMock = jest.fn().mockResolvedValue({});
    (useSWRMutation as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      mutate: mutateMock,
    }));

    render(<LetterForm />);

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'An error occurred while fetching data.',
        type: 'error',
      }),
    );
  });

  it('Call onError handler on mutation failure with default message.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/correspondence?limit=500') {
        return {
          data: {
            data: [
              {
                correspondenceId: 'c1',
                recipient: { firstName: 'Test', lastName: 'User' },
                title: 'Test Correspondence',
              },
            ],
          },
          isLoading: false,
        };
      }
      return {};
    });

    const mutateMock = jest.fn().mockResolvedValue({});
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onError?.({});
        mutateMock({ body });
      },
    }));

    render(<LetterForm />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Letter Text'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'EMAIL' },
    });
    fireEvent.change(screen.getByLabelText('Method'), {
      target: { value: 'DIGITAL' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'SENT' },
    });

    const input = screen.getByTestId('correspondenceId');
    fireEvent.focus(input);

    const option = await screen.getByText('User, Test - Test Correspondence');
    fireEvent.click(option);

    fireEvent.click(screen.getByDisplayValue('Create'));

    await waitFor(() => {
      const body = mutateMock.mock.calls[0][0].body;
      expect(body.correspondenceId).toBe('c1');
    });
  });

  it('Call onError handler on mutation failure with error message.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path === '/correspondence?limit=500') {
        return {
          data: {
            data: [
              {
                correspondenceId: 'c1',
                recipient: { firstName: 'Test', lastName: 'User' },
                title: 'Test Correspondence',
              },
            ],
          },
          isLoading: false,
        };
      }
      return {};
    });

    const mutateMock = jest.fn().mockResolvedValue({});
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onError?.({ error: 'Mock error!', status: 400 });
        mutateMock({ body });
      },
    }));

    render(<LetterForm />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Letter Text'), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'EMAIL' },
    });
    fireEvent.change(screen.getByLabelText('Method'), {
      target: { value: 'DIGITAL' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'SENT' },
    });

    const input = screen.getByTestId('correspondenceId');
    fireEvent.focus(input);

    const option = await screen.getByText('User, Test - Test Correspondence');
    fireEvent.click(option);

    fireEvent.click(screen.getByDisplayValue('Create'));

    await waitFor(() => {
      const body = mutateMock.mock.calls[0][0].body;
      expect(body.correspondenceId).toBe('c1');
    });
  });

  it('Updates correspondenceId if letterId is missing and correspondenceId is available.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'letterId') return null;
        if (key === 'correspondenceId') return null;
        return null;
      },
    });

    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    (useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });

    render(<LetterForm />);

    await waitFor(() => {
      expect(screen.getByText('Letter Form')).toBeInTheDocument();
    });
  });

  it('Should allow user to update image.', async () => {
    const mutateMock = jest.fn().mockResolvedValue({});
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onSuccess?.({ response: { data: { imageURLs: [] } } });
        mutateMock({ body });
      },
    }));
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    render(<LetterForm />);

    expect(screen.getByText('Caption!')).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId('edit-button-icon')[0]);

    await waitFor(() => {
      expect(screen.getByText('Update Image')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Caption'), {
      target: { value: 'New caption' },
    });

    fireEvent.change(screen.getByLabelText('View'), {
      target: { value: View.OTHER },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Image' }));
  });

  it('Should allow user to add image.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    await act(async () => {
      render(<LetterForm />);
    });

    expect(await screen.findByText('Caption!')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Add Image +'));
    });

    expect(await screen.findByText('Add New Image')).toBeInTheDocument();

    const input =
      screen.getByTestId('file-input') ||
      screen.getByLabelText('Select Image +').closest('label')?.nextSibling;

    await act(async () => {
      fireEvent.change(input as Element, {
        target: {
          files: [new File(['test'], 'new-image.png', { type: 'image/png' })],
        },
      });
    });

    expect(await screen.findByText('new-image.png')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Upload Image +' }));
    });

    // Optionally wait for UI update after upload
    // expect(await screen.findByText('Uploaded!')).toBeInTheDocument();
  });

  it('Should handle file upload errors.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: jest.fn(),
      isUploading: false,
      error: 'Error during upload!',
    });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    render(<LetterForm />);

    expect(screen.getByText('Caption!')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Add Image +'));

    await waitFor(() => {
      expect(screen.getByText('Add New Image')).toBeInTheDocument();
    });

    const input =
      screen.getByTestId('file-input') ||
      screen.getByLabelText('Select Image +').closest('label')?.nextSibling;

    fireEvent.change(input, {
      target: {
        files: [new File(['test'], 'new-image.png', { type: 'image/png' })],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('new-image.png')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Upload Image +' }));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error during upload!',
          type: 'error',
        }),
      );
    });
  });

  it('Should update form state after adding image.', async () => {
    (useFileUpload as jest.Mock).mockReturnValue({
      uploadFile: jest.fn().mockResolvedValue({
        message: 'Success!',
        imageURL: { id: 'id', url: '/imageURL' },
      }),
      isUploading: false,
      error: null,
    });
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    await act(async () => {
      render(<LetterForm />);
    });

    expect(screen.getByText('Caption!')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Add Image +'));
    });

    await waitFor(() => {
      expect(screen.getByText('Add New Image')).toBeInTheDocument();
    });

    const input =
      screen.getByTestId('file-input') ||
      screen.getByLabelText('Select Image +').closest('label')?.nextSibling;

    await act(async () => {
      fireEvent.change(input!, {
        target: {
          files: [new File(['test'], 'new-image.png', { type: 'image/png' })],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('new-image.png')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Upload Image +' }));
    });
  });

  it('Should allow user to cancel adding image.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    render(<LetterForm />);

    expect(screen.getByText('Caption!')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Add Image +'));

    await waitFor(() => {
      expect(screen.getByText('Add New Image')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-image-close-icon'));

    await waitFor(() => {
      expect(screen.queryByText('Add New Image')).toBeNull();
    });
  });

  it('Should delete an image when confirmed.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    (useDeleteUpload as jest.Mock).mockReturnValue({
      deleteFile: jest.fn().mockResolvedValue({ imageURLs: [] }),
      isDeleting: false,
      error: null,
    });

    render(<LetterForm />);

    expect(screen.getByText('Caption!')).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId('delete-button')[0]);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(
        useDeleteUpload({ letter: {} as Letter, token: null }).deleteFile,
      ).toHaveBeenCalledWith({ imageId: 'id1' });
    });
  });

  it('Should handle delete image errors.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    (useDeleteUpload as jest.Mock).mockReturnValue({
      deleteFile: jest.fn().mockResolvedValue({ imageURLs: [] }),
      isDeleting: false,
      error: 'Failed to delete!',
    });

    render(<LetterForm />);

    expect(screen.getByText('Caption!')).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId('delete-button')[0]);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to delete!',
          type: 'error',
        }),
      );
    });
  });

  it('Should show progress spinner when deleting or updating.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    (useDeleteUpload as jest.Mock).mockReturnValue({
      deleteFile: jest.fn().mockResolvedValue({ imageURLs: [] }),
      isDeleting: true,
      error: null,
    });

    render(<LetterForm />);

    await waitFor(() => {
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });
  });

  it('Should dismiss confirmation modal.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => '123' });
    (useSWRQuery as jest.Mock).mockImplementation(({ path }) => {
      if (path?.startsWith('/correspondence/')) {
        return {
          data: {
            data: {
              correspondence: {
                correspondenceId: 'mock-correspondence-id',
              },
            },
          },
          error: null,
          isLoading: false,
        };
      }
      if (path?.startsWith('/letter')) {
        return {
          data: {
            data: {
              letterId: '123',
              imageURLs: [
                {
                  caption: 'Caption!',
                  id: 'id1',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
                {
                  id: 'id2',
                  url: '/url',
                  urlThumbnail: '/thumb',
                  view: View.ENVELOPE_BACK,
                },
              ],
            },
          },
          isLoading: false,
          error: null,
        };
      }
      return { data: {}, error: null, isLoading: false };
    });

    (useDeleteUpload as jest.Mock).mockReturnValue({
      deleteFile: jest.fn().mockResolvedValue({ imageURLs: [] }),
      isDeleting: false,
      error: null,
    });

    render(<LetterForm />);

    expect(screen.getByText('Caption!')).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId('delete-button')[0]);

    fireEvent.click(screen.getAllByDisplayValue('Cancel')[1]);

    await waitFor(() => {
      expect(screen.queryByText('Delete')).toBeNull();
    });
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterForm />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
