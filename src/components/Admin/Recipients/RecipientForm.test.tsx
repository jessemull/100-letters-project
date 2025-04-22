import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@contexts/AuthProvider';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { useSWRMutation } from '@hooks/useSWRMutation';
import RecipientForm from './RecipientForm';

jest.mock('@contexts/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@hooks/useSWRQuery', () => ({
  useSWRQuery: jest.fn(),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('RecipientForm', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockImplementation(
      jest.fn().mockReturnValue({ loading: false, token: 'mockToken' }),
    );
    (useSWRQuery as jest.Mock).mockImplementation(
      jest.fn().mockReturnValue({
        data: {
          data: {
            address: {},
            recipientId: '123',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
        isLoading: false,
      }),
    );
    (useSWRMutation as jest.Mock).mockImplementation(
      jest.fn().mockReturnValue({ mutate: mockMutate, isLoading: false }),
    );
    (useRouter as jest.Mock).mockImplementation(
      jest.fn().mockReturnValue({ back: jest.fn() }),
    );
    (useSearchParams as jest.Mock).mockImplementation(
      jest.fn().mockReturnValue(new URLSearchParams({ recipientId: '123' })),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form and calls useSWRQuery', () => {
    render(<RecipientForm />);

    expect(screen.getByText(/Recipient Form/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(useSWRQuery).toHaveBeenCalledWith('/recipient/123', 'mockToken');
  });

  it('handles form submission and calls onSuccess', async () => {
    const backMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: backMock });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams({}));

    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onSuccess?.();
      },
    }));

    render(<RecipientForm />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Organization/i), {
      target: { value: 'OpenAI' },
    });
    fireEvent.change(screen.getByLabelText(/Occupation/i), {
      target: { value: 'Engineer' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'A test recipient' },
    });
    fireEvent.change(screen.getByLabelText(/Street/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: 'Portland' },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: 'OR' },
    });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), {
      target: { value: '97201' },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: 'USA' },
    });

    fireEvent.click(screen.getByDisplayValue(/Create/i));

    await waitFor(() => {
      expect(backMock).toHaveBeenCalled();
    });
  });

  it('calls router.back when cancel is clicked', () => {
    render(<RecipientForm />);

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(useRouter().back).toHaveBeenCalled();
  });

  it('disables the submit button if the form is not dirty or has errors', () => {
    (useSWRQuery as jest.Mock).mockReturnValueOnce({ isLoading: false });
    render(<RecipientForm />);
    expect(screen.getByDisplayValue(/Update/i)).toBeDisabled();
  });

  it('renders the loading spinner when data is loading or authenticating', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      loading: true,
      token: 'mockToken',
    });
    (useSWRQuery as jest.Mock).mockReturnValueOnce({
      data: {},
      isLoading: true,
    });

    render(<RecipientForm />);

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('sets form values if recipient data is available', () => {
    render(<RecipientForm />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });
});
