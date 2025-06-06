import * as AuthProvider from '@contexts/AuthProvider';
import React from 'react';
import showToast from '@components/Form/Toast';
import { AuthContextType } from '@contexts/AuthProvider';
import { LettersTab } from '@components/Admin';
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
const testLetter = { letterId: '1', title: 'Test Letter' };

describe('LettersTab Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AuthProvider.useAuth as jest.Mock).mockReturnValue({
      token: 'token',
    } as AuthContextType);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (showToast as jest.Mock).mockClear();
  });

  it('Displays loading state.', () => {
    useSWRQuery.mockReturnValue({ data: undefined, isLoading: true });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<LettersTab search="" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Renders letter list.', () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testLetter], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<LettersTab search="" />);
    expect(screen.getByText('Test Letter')).toBeInTheDocument();
  });

  it('Renders empty state.', () => {
    useSWRQuery.mockReturnValue({
      data: { data: [], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<LettersTab search="" />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('Opens and confirms delete modal.', async () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testLetter], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: mockMutate });
    render(<LettersTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        path: `/letter/1`,
        params: { letterId: '1' },
      });
    });
  });

  it('Navigates to edit letter.', () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testLetter], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<LettersTab search="" />);
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(mockPush).toHaveBeenCalledWith('/admin/letter?letterId=1');
  });

  it('Calls onSuccess and shows success toast.', async () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testLetter], lastEvaluatedKey: '' },
      isLoading: false,
    });
    const mutateFn = async (_: any) => {
      const onSuccess = useSWRMutation.mock.calls[0][0].onSuccess;
      if (onSuccess) onSuccess({});
      const onUpdate = useSWRMutation.mock.calls[0][0].onUpdate;
      if (onUpdate)
        onUpdate({
          prev: { data: [testLetter], lastEvaluatedKey: '' },
          params: { letterId: '1' },
        });
    };
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: mutateFn });
    render(<LettersTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'Letter deleted successfully!',
        type: 'success',
      });
    });
  });

  it('Calls onError and shows error toast.', async () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testLetter], lastEvaluatedKey: '' },
      isLoading: false,
    });
    const mutateFn = async (_: any) => {
      const onError = useSWRMutation.mock.calls[0][0].onError;
      if (onError) onError({ error: 'Something went wrong' });
      const onUpdate = useSWRMutation.mock.calls[0][0].onUpdate;
      if (onUpdate) onUpdate({});
    };
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: mutateFn });
    render(<LettersTab search="" />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'Something went wrong',
        type: 'error',
      });
    });
  });

  it('Triggers fetchMore when inView is true, loadingMore is false, and lastEvaluatedKey is not null', async () => {
    const fetchMore = jest.fn();

    useSWRQuery.mockReturnValue({
      data: { data: [testLetter], lastEvaluatedKey: '123' },
      fetchMore,
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });

    render(<LettersTab search="" />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(fetchMore).toHaveBeenCalledWith('/letter?lastEvaluatedKey=123');
    });
  });

  it('Triggers fetchMore with search term in path when search is set.', async () => {
    const fetchMore = jest.fn();

    useSWRQuery.mockReturnValue({
      data: {
        data: [testLetter],
        lastEvaluatedKey: '456',
      },
      fetchMore,
      isLoading: false,
      loadingMore: false,
    });

    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });

    render(<LettersTab search="test-search" />);

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(fetchMore).toHaveBeenCalledWith(
        '/letter?lastEvaluatedKey=456&search=test-search',
      );
    });
  });

  it('Does not assign ref to non-last list items.', () => {
    const letters = [
      { letterId: '1', title: 'Letter One' },
      { letterId: '2', title: 'Letter Two' },
      { letterId: '3', title: 'Letter Three' },
    ];

    const mockRef = jest.fn();

    const useInViewMock = require('react-intersection-observer').useInView;
    useInViewMock.mockReturnValue({
      inView: false,
      ref: mockRef,
    });

    useSWRQuery.mockReturnValue({
      data: { data: letters, lastEvaluatedKey: '' },
      isLoading: false,
    });

    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });

    const { container } = render(<LettersTab search="" />);
    const listItems = container.querySelectorAll('li');

    expect(mockRef).toHaveBeenCalledTimes(1);
    expect(listItems.length).toBe(3);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LettersTab search="" />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
