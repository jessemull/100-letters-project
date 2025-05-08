import ImageItem from './ImageItem';
import { LetterImage, View } from '@ts-types/letter';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@contexts/AuthProvider';
import { useImageModal } from '@contexts/ImageModalContext';
import { useSWRMutation } from '@hooks/useSWRMutation';

jest.mock('@contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@contexts/ImageModalContext', () => ({
  useImageModal: jest.fn(),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn(),
}));

describe('ImageItem Component', () => {
  const mockMutate = jest.fn();
  const mockDeleteImage = jest.fn();
  const mockOnUpdateImage = jest.fn();
  const mockShowImage = jest.fn();

  const letter = {
    letterId: '1',
    correspondenceId: '1',
    imageURLs: [
      {
        id: 'img1',
        caption: 'test caption',
        view: View.LETTER_FRONT,
        url: '/url.jpg',
        urlThumbnail: '/thumb.jpg',
      },
      {
        id: 'img2',
        caption: 'test caption 2',
        view: View.LETTER_BACK,
        url: '/url.jpg',
        urlThumbnail: '/thumb.jpg',
      },
    ],
  };

  const data = {
    id: 'img1',
    caption: 'test caption',
    view: View.LETTER_FRONT,
    url: '/url.jpg',
    urlThumbnail: '/thumb.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ token: 'mock-token' });
    (useImageModal as jest.Mock).mockReturnValue({ showImage: mockShowImage });
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
  });

  it('Renders image and displays caption and view label.', () => {
    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    expect(screen.getByText('Letter Front')).toBeInTheDocument();
    expect(screen.getByText('test caption')).toBeInTheDocument();
  });

  it('Renders image and displays default caption.', () => {
    const { caption, ...rest } = data;
    render(
      <ImageItem
        data={rest as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    expect(screen.getByText('Letter Front')).toBeInTheDocument();
    expect(screen.getByText('No Caption')).toBeInTheDocument();
  });

  it('Renders image and handles long captions.', () => {
    const { caption, ...rest } = data;
    render(
      <ImageItem
        data={
          {
            caption: 'This is a really long caption that will be truncated',
            ...rest,
          } as LetterImage
        }
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    expect(screen.getByText('Letter Front')).toBeInTheDocument();
    expect(
      screen.getByText('This is a really long cap...'),
    ).toBeInTheDocument();
  });

  it('Handles image modal open.', async () => {
    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    fireEvent.click(screen.getAllByTestId('full-screen-button-icon')[0]);
    await waitFor(() => {
      expect(mockShowImage).toHaveBeenCalledWith('/url.jpg', 'No Image');
    });
  });

  it('Toggles edit form visibility.', () => {
    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    expect(screen.queryByLabelText('Caption')).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByTestId('edit-button-icon')[0]);
    expect(screen.getByLabelText('Caption')).toBeInTheDocument();
  });

  it('Calls deleteImage when trash icon is clicked.', () => {
    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(mockDeleteImage).toHaveBeenCalledWith('img1');
  });

  it('Submits image update.', async () => {
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate.mockResolvedValue(undefined),
      isLoading: false,
    });

    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    fireEvent.click(screen.getAllByTestId('edit-button-icon')[0]);
    fireEvent.change(screen.getByLabelText('Caption'), {
      target: { value: 'New caption' },
    });
    fireEvent.change(screen.getByLabelText('View'), {
      target: { value: View.OTHER },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Image' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('Shows loading indicator when isLoading is true.', () => {
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: true,
    });

    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Calls onSuccess and handles success UI updates.', async () => {
    const mockResponse = {
      data: {
        imageURLs: [
          { id: 'img1', caption: 'Updated Caption', view: View.LETTER_BACK },
        ],
      },
    };

    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      mutate: async () => {
        await onSuccess({ response: mockResponse });
      },
      isLoading: false,
    }));

    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    fireEvent.click(screen.getByTestId('edit-button-icon'));

    fireEvent.click(screen.getByRole('button', { name: 'Update Image' }));

    await waitFor(() => {
      expect(mockOnUpdateImage).toHaveBeenCalledWith(
        mockResponse.data.imageURLs,
      );
    });
  });

  it('Calls onError and handles error UI updates.', async () => {
    const error = 'Something went wrong';
    const status = '500';

    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      mutate: async () => {
        await onError({
          error,
          status,
        });
      },
      isLoading: false,
    }));

    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    fireEvent.click(screen.getByTestId('edit-button-icon'));

    fireEvent.change(screen.getByLabelText('Caption'), {
      target: { value: 'Changed Caption' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Image' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Caption')).toHaveValue('test caption');
      expect(mockOnUpdateImage).not.toHaveBeenCalled();
    });
  });

  it('Calls onError and handles error UI updates with default error and status.', async () => {
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      mutate: async () => {
        await onError({});
      },
      isLoading: false,
    }));

    render(
      <ImageItem
        data={data as LetterImage}
        deleteImage={mockDeleteImage}
        letter={letter as any}
        onUpdateImage={mockOnUpdateImage}
      />,
    );

    fireEvent.click(screen.getByTestId('edit-button-icon'));

    fireEvent.change(screen.getByLabelText('Caption'), {
      target: { value: 'Changed Caption' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Image' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Caption')).toHaveValue('test caption');
      expect(mockOnUpdateImage).not.toHaveBeenCalled();
    });
  });
});
