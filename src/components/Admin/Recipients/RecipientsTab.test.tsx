import * as AuthProvider from '@contexts/AuthProvider';
import React from 'react';
import showToast from '@components/Form/Toast';
import { AuthContextType } from '@contexts/AuthProvider';
import { Recipient } from '@ts-types/recipients';
import { RecipientFactory } from '@factories/recipient';
import { RecipientsTab } from '@components/Admin';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({
    inView: true,
    ref: jest.fn(),
  })),
}));

jest.mock('@hooks/useSWRQuery', () => ({
  __esModule: true,
  useSWRQuery: jest.fn(),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  __esModule: true,
  useSWRMutation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@contexts/AuthProvider', () => ({
  __esModule: true,
  ...jest.requireActual('@contexts/AuthProvider'),
  useAuth: jest.fn(),
}));

jest.mock('@components/Form/Toast', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockPush = jest.fn();
const mockMutate = jest.fn();
const useSWRQuery = require('@hooks/useSWRQuery').useSWRQuery;
const useSWRMutation = require('@hooks/useSWRMutation').useSWRMutation;

describe('RecipientsTab Component', () => {
  const mockRecipient: Recipient = RecipientFactory.build();

  beforeEach(() => {
    jest.clearAllMocks();

    (AuthProvider.useAuth as jest.Mock).mockReturnValue({
      token: 'test-token',
    } as AuthContextType);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (showToast as jest.Mock).mockClear();
  });

  it('Renders loading state.', () => {
    useSWRQuery.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }));

    useSWRMutation.mockImplementation(() => ({
      error: null,
      isLoading: false,
      mutate: jest.fn(),
      response: {},
    }));

    render(<RecipientsTab search="" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Renders recipient list.', () => {
    useSWRQuery.mockImplementation(() => ({
      data: {
        data: [
          mockRecipient,
          { ...mockRecipient, recipientId: 'id2', firstName: 'Johnny' },
        ],
        lastEvaluatedKey: '',
      },
      isLoading: false,
    }));

    useSWRMutation.mockImplementation(() => ({
      error: null,
      isLoading: false,
      mutate: jest.fn(),
      response: {},
    }));

    render(<RecipientsTab search="" />);
    expect(
      screen.getByText(`${mockRecipient.lastName}, ${mockRecipient.firstName}`),
    ).toBeInTheDocument();
  });

  it('Renders empty state when there are no recipients.', () => {
    useSWRQuery.mockImplementation(() => ({
      data: { data: [], lastEvaluatedKey: '' },
      isLoading: false,
    }));

    useSWRMutation.mockImplementation(() => ({
      error: null,
      isLoading: false,
      mutate: jest.fn(),
      response: {},
    }));

    render(<RecipientsTab search="" />);

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('Opens and confirms deletion via modal.', async () => {
    useSWRQuery.mockImplementation(() => ({
      data: { data: [mockRecipient], lastEvaluatedKey: '' },
      isLoading: false,
    }));

    useSWRMutation.mockImplementation(() => ({
      error: null,
      isLoading: false,
      mutate: mockMutate,
      response: {},
    }));

    render(<RecipientsTab search="" />);

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(screen.getByText('Delete Recipient')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        path: `/recipient/${mockRecipient.recipientId}`,
        params: { recipientId: mockRecipient.recipientId },
      });
    });
  });

  it('Navigates to edit page on edit.', () => {
    useSWRQuery.mockImplementation(() => ({
      data: { data: [mockRecipient], lastEvaluatedKey: '' },
      isLoading: false,
    }));

    useSWRMutation.mockImplementation(() => ({
      error: null,
      isLoading: false,
      mutate: jest.fn(),
      response: {},
    }));

    render(<RecipientsTab search="" />);
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(mockPush).toHaveBeenCalledWith(
      `/admin/recipient?recipientId=${mockRecipient.recipientId}`,
    );
  });

  it('Calls onSuccess and shows success toast.', async () => {
    useSWRQuery.mockImplementation(() => ({
      data: { data: [mockRecipient], lastEvaluatedKey: '' },
      isLoading: false,
    }));

    const mutateFn = async (_: any) => {
      const onSuccess = useSWRMutation.mock.calls[0][0].onSuccess;
      if (onSuccess) onSuccess({});

      const onUpdate = useSWRMutation.mock.calls[0][0].onUpdate;
      if (onUpdate)
        onUpdate({
          prev: { data: [{ recipientId: 'recipientId' }] },
          lastEvaluatedKey: 'key',
        });
    };

    useSWRMutation.mockImplementation(() => ({
      isLoading: false,
      mutate: mutateFn,
      response: {},
    }));

    render(<RecipientsTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'Recipient deleted successfully!',
        type: 'success',
      });
    });
  });

  it('Calls onError and shows error toast.', async () => {
    useSWRQuery.mockImplementation(() => ({
      data: { data: [mockRecipient], lastEvaluatedKey: '' },
      isLoading: false,
    }));

    const mutateFn = async (_: any) => {
      const onError = useSWRMutation.mock.calls[0][0].onError;
      if (onError) onError({ error: 'Something went wrong' });

      const onUpdate = useSWRMutation.mock.calls[0][0].onUpdate;
      if (onUpdate) onUpdate({});
    };

    useSWRMutation.mockImplementation(() => ({
      isLoading: false,
      mutate: mutateFn,
      response: {},
    }));

    render(<RecipientsTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'Something went wrong',
        type: 'error',
      });
    });
  });

  it('Triggers fetchMore when inView is true, loadingMore is false, and lastEvaluatedKey is not null.', async () => {
    const fetchMore = jest.fn();

    useSWRQuery.mockReturnValue({
      data: { data: [mockRecipient], lastEvaluatedKey: '123' },
      fetchMore,
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });

    render(<RecipientsTab search="" />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(fetchMore).toHaveBeenCalledWith('/recipient?lastEvaluatedKey=123');
    });
  });

  it('Uses search query param when search is defined.', async () => {
    const mockSearch = 'john';

    useSWRQuery.mockImplementation(() => {
      return {
        config: {
          shouldRetryOnError: false,
        },
        data: { data: [], lastEvaluatedKey: '' },
        isLoading: false,
      };
    });

    useSWRMutation.mockImplementation(() => ({
      error: null,
      isLoading: false,
      mutate: jest.fn(),
      response: {},
    }));

    render(<RecipientsTab search={mockSearch} />);

    await waitFor(() => {
      expect(useSWRQuery).toHaveBeenCalledWith({
        config: {
          shouldRetryOnError: false,
        },
        path: `/recipient?search=${mockSearch}`,
        token: 'test-token',
      });
    });
  });

  it('Triggers fetchMore with lastEvaluatedKey and search when both are present.', async () => {
    const fetchMore = jest.fn();
    const mockSearch = 'john';

    useSWRQuery.mockReturnValue({
      data: { data: [mockRecipient], lastEvaluatedKey: '123' },
      fetchMore,
      isLoading: false,
    });

    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });

    render(<RecipientsTab search={mockSearch} />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(fetchMore).toHaveBeenCalledWith(
        '/recipient?lastEvaluatedKey=123&search=john',
      );
    });
  });

  it('Has no accessibility violations.', async () => {
    useSWRQuery.mockImplementation(() => ({
      data: { data: [], lastEvaluatedKey: '' },
      isLoading: false,
    }));

    useSWRMutation.mockImplementation(() => ({
      error: null,
      isLoading: false,
      mutate: jest.fn(),
      response: {},
    }));

    const { container } = render(<RecipientsTab search="" />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
