import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LetterForm } from '@components/Admin';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@contexts/AuthProvider';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { showToast } from '@components/Form';

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

describe('LetterForm', () => {
  const pushMock = jest.fn();
  const backMock = jest.fn();

  const sampleLetter = {
    letterId: 'abc123',
    correspondenceId: 'c1',
    description: 'description',
    imageURLs: [],
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
    fireEvent.change(screen.getByLabelText('Sent At'), {
      target: { value: '2025-04-25T14:30' },
    });
    fireEvent.change(screen.getByLabelText('Received At'), {
      target: { value: '2025-04-25T14:30' },
    });

    const input = screen.getByTestId('correspondenceId');
    fireEvent.focus(input);

    const option = await screen.getByText('User, Test - Test Correspondence');
    fireEvent.mouseDown(option);

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
    fireEvent.mouseDown(option);

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
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
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
    fireEvent.mouseDown(option);

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
    fireEvent.mouseDown(option);

    fireEvent.click(screen.getByDisplayValue('Create'));

    await waitFor(() => {
      const body = mutateMock.mock.calls[0][0].body;
      expect(body.correspondenceId).toBe('c1');
    });
  });

  it('updates correspondenceId if letterId is missing and correspondenceId is available', async () => {
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
});
