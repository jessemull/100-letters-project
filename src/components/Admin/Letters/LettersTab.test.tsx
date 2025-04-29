import * as AuthProvider from '@contexts/AuthProvider';
import React from 'react';
import showToast from '@components/Form/Toast';
import { AuthContextType } from '@contexts/AuthProvider';
import { LetterImageFactory } from '@factories/letter';
import { LettersTab } from '@components/Admin';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

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

describe('LettersTab', () => {
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
    render(<LettersTab />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Renders letter list.', () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testLetter, LetterImageFactory.build()], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<LettersTab />);
    expect(screen.getByText('Test Letter')).toBeInTheDocument();
  });

  it('Renders empty state.', () => {
    useSWRQuery.mockReturnValue({
      data: { data: [], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: jest.fn() });
    render(<LettersTab />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('Opens and confirms delete modal.', async () => {
    useSWRQuery.mockReturnValue({
      data: { data: [testLetter], lastEvaluatedKey: '' },
      isLoading: false,
    });
    useSWRMutation.mockReturnValue({ isLoading: false, mutate: mockMutate });
    render(<LettersTab />);
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
    render(<LettersTab />);
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
    render(<LettersTab />);
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
    render(<LettersTab />);
    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith({
        message: 'Something went wrong',
        type: 'error',
      });
    });
  });
});
