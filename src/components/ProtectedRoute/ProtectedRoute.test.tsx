import ProtectedRoute from './ProtectedRoute';
import React from 'react';
import { render } from '@testing-library/react';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';

jest.mock('@contexts/AuthProvider');
jest.mock('next/navigation');

describe('ProtectedRoute Component', () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
    });
  });

  it('Redirects to /forbidden if user is not authenticated and not loading.', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      loading: false,
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    );

    expect(replaceMock).toHaveBeenCalledWith('/forbidden');
  });
});
