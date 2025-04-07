import * as useDataHook from '../hooks/useSWRWithAuth';
import Admin from './Admin';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';

jest.mock('../contexts/AuthProvider');
jest.mock('next/navigation');
jest.mock('../hooks/useSWRWithAuth');

describe('Admin Component', () => {
  it('Redirects to /403 if user is not logged in and not authenticating.', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      loading: false,
      token: null,
    });

    const mockUseSWRWithAuth = useDataHook.useSWRWithAuth as jest.Mock;
    mockUseSWRWithAuth.mockReturnValue({ data: [], isLoading: true });

    render(<Admin />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/403');
    });
  });
});
