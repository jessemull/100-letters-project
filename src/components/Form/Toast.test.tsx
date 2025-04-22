import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { showToast } from '@components/Form';
import { toast } from 'react-hot-toast';

// Mocking `react-hot-toast` with type-safe custom mock
jest.mock('react-hot-toast', () => {
  const actual = jest.requireActual('react-hot-toast');
  return {
    ...actual,
    toast: {
      custom: jest.fn(),
      dismiss: jest.fn(),
    },
  };
});

describe('showToast', () => {
  const mockToastCustom = toast.custom as jest.Mock;
  const mockToastDismiss = toast.dismiss as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders success toast with correct icon and message', () => {
    // Render the toast content manually using the custom mock
    showToast({ type: 'success', message: 'Operation successful' });

    // Grab the render function passed to toast.custom and render it
    expect(mockToastCustom).toHaveBeenCalledTimes(1);
    const renderFn = mockToastCustom.mock.calls[0][0];
    const mockT = { id: 'mock-id' } as Parameters<typeof renderFn>[0];

    render(renderFn(mockT));

    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.getByTestId('lucide-icon-success')).toBeInTheDocument();
  });

  it('renders error toast with correct icon and message', () => {
    showToast({ type: 'error', message: 'Something went wrong' });

    const renderFn = mockToastCustom.mock.calls[0][0];
    const mockT = { id: 'mock-id' } as Parameters<typeof renderFn>[0];

    render(renderFn(mockT));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.getByTestId('lucide-icon-error')).toBeInTheDocument();
  });

  it('dismisses the toast when the close button is clicked', () => {
    showToast({ type: 'error', message: 'Dismiss me' });

    const renderFn = mockToastCustom.mock.calls[0][0];
    const mockT = { id: 'toast-id-123' } as Parameters<typeof renderFn>[0];

    render(renderFn(mockT));

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockToastDismiss).toHaveBeenCalledWith('toast-id-123');
  });
});
