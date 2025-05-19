import * as AuthProvider from '@contexts/AuthProvider';
import React from 'react';
import showToast from '@components/Form/Toast';
import { CorrespondencesTab } from '@components/Admin';
import { axe } from 'jest-axe';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

const useSWRQuery = require('@hooks/useSWRQuery').useSWRQuery;
const useSWRMutation = require('@hooks/useSWRMutation').useSWRMutation;
const mockPush = jest.fn();
const mockMutate = jest.fn();
const testCorrespondence = {
  correspondenceId: '1',
  title: 'Test Correspondence',
};

describe('CorrespondencesTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AuthProvider.useAuth as jest.Mock).mockReturnValue({
      token: 'token',
    } as AuthProvider.AuthContextType);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (showToast as jest.Mock).mockClear();
  });

  it('Displays loading state.', () => {
    useSWRQuery.mockReturnValue({ data: undefined, isLoading: true });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<CorrespondencesTab search="" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Renders correspondence list.', () => {
    useSWRQuery.mockReturnValue({
      data: {
        data: [
          testCorrespondence,
          {
            ...testCorrespondence,
            correspondenceId: 'id2',
            title: 'Test Correspondence 2',
          },
        ],
        lastEvaluatedKey: '',
      },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<CorrespondencesTab search="" />);
    expect(screen.getByText('Test Correspondence')).toBeInTheDocument();
  });

  it('Renders empty state.', () => {
    useSWRQuery.mockReturnValue({
      data: { data: [], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<CorrespondencesTab search="" />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('Opens and confirms delete modal.', async () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testCorrespondence], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: mockMutate });
    render(<CorrespondencesTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        path: `/correspondence/1`,
        params: { correspondenceId: '1' },
      });
    });
  });

  it('Navigates to edit correspondence.', () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testCorrespondence], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<CorrespondencesTab search="" />);
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(mockPush).toHaveBeenCalledWith(
      '/admin/correspondence?correspondenceId=1',
    );
  });

  it('Calls onSuccess and shows success toast.', async () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testCorrespondence], lastEvaluatedKey: '' },
      isLoading: false,
    });
    const mutateFn = async (_: any) => {
      const onSuccess = useSWRMutation.mock.calls[0][0].onSuccess;
      if (onSuccess) onSuccess({});
      const onUpdate = useSWRMutation.mock.calls[0][0].onUpdate;
      if (onUpdate)
        onUpdate({
          prev: { data: [testCorrespondence], lastEvaluatedKey: '' },
          params: { correspondenceId: '1' },
        });
    };
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: mutateFn });
    render(<CorrespondencesTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'Correspondence deleted successfully!',
        type: 'success',
      });
    });
  });

  it('Calls onError and shows error toast.', async () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testCorrespondence], lastEvaluatedKey: '' },
      isLoading: false,
    });
    const mutateFn = async (_: any) => {
      const onError = useSWRMutation.mock.calls[0][0].onError;
      if (onError) onError({ error: 'Something went wrong' });
      const onUpdate = useSWRMutation.mock.calls[0][0].onUpdate;
      if (onUpdate) onUpdate({});
    };
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: mutateFn });
    render(<CorrespondencesTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'Something went wrong',
        type: 'error',
      });
    });
  });

  it('Calls closeConfirmationModal when modal is closed.', async () => {
    render(<CorrespondencesTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryAllByText('Cancel')).toHaveLength(0);
    });
  });

  it('Triggers fetchMore when inView is true, loadingMore is false, and lastEvaluatedKey is not null', async () => {
    const fetchMore = jest.fn();

    useSWRQuery.mockReturnValue({
      data: { data: [testCorrespondence], lastEvaluatedKey: '123' },
      fetchMore,
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });

    render(<CorrespondencesTab search="" />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(fetchMore).toHaveBeenCalledWith(
        '/correspondence?lastEvaluatedKey=123',
      );
    });
  });

  it('Fetches data with search term and then fetches more when in view', async () => {
    const fetchMoreMock = jest.fn();
    const initialData = {
      data: [
        { correspondenceId: '1', title: 'First' },
        { correspondenceId: '2', title: 'Second' },
      ],
      lastEvaluatedKey: 'next-key',
    };

    useSWRQuery.mockReturnValue({
      data: initialData,
      fetchMore: fetchMoreMock,
      isLoading: false,
      loadingMore: false,
    });

    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });

    render(<CorrespondencesTab search="query" />);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMoreMock).toHaveBeenCalledWith(
        '/correspondence?lastEvaluatedKey=next-key&search=query',
      );
    });
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<CorrespondencesTab search="" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
