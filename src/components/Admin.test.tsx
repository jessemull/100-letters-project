import * as useDataHook from '../hooks/useSWRQuery';
import Admin from './Admin';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';

jest.mock('../contexts/AuthProvider');
jest.mock('next/navigation');
jest.mock('../hooks/useSWRQuery');

describe('Admin Component', () => {
  it('Redirects to /403 if user is not logged in and not authenticating.', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      loading: false,
      token: null,
    });

    const mockuseSWRQuery = useDataHook.useSWRQuery as jest.Mock;
    mockuseSWRQuery.mockReturnValue({ data: [], isLoading: true });

    render(<Admin />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/forbidden');
    });
  });
});
