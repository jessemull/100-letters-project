import RecipientForm from './RecipientForm';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import showToast from '../../Form/Toast';

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

jest.mock('../../Form/Toast', () => ({
  __esModule: true,
  default: jest.fn(),
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
            address: {
              city: 'Corvallis',
              country: 'USA',
              postalCode: '97333',
              state: 'OR',
              street: 'Sunset Drive',
            },
            description: 'Example description...',
            firstName: 'John',
            lastName: 'Doe',
            occupation: 'Parks Director',
            organization: 'Pawnee Parks & Rec',
            recipientId: '123',
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

  it('Renders the form and calls useSWRQuery.', () => {
    render(<RecipientForm />);
    expect(screen.getByText(/Recipient Form/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(useSWRQuery).toHaveBeenCalledWith({
      config: { shouldRetryOnError: false },
      path: '/recipient/123',
      token: 'mockToken',
    });
  });

  it('Handles form submission and calls onSuccess.', async () => {
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

  it('Calls router.back when cancel is clicked.', () => {
    render(<RecipientForm />);

    fireEvent.click(screen.getByText(/Cancel/i));

    expect(useRouter().back).toHaveBeenCalled();
  });

  it('Disables the submit button if the form is not dirty or has errors.', () => {
    (useSWRQuery as jest.Mock).mockReturnValueOnce({ isLoading: false });
    render(<RecipientForm />);
    expect(screen.getByDisplayValue(/Update/i)).toBeDisabled();
  });

  it('Renders the loading spinner when data is loading or authenticating.', () => {
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

  it('Sets form values if recipient data is available.', () => {
    render(<RecipientForm />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  it('Handles form errors on submission and calls onError with default message.', async () => {
    const backMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: backMock });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams({}));

    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onError?.({});
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

    expect(showToast).toHaveBeenCalledWith({
      message: 'An error occurred during data update.',
      type: 'error',
    });
  });

  it('Handles form errors on submission and calls onError with error message.', async () => {
    const backMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: backMock });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams({}));

    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onError?.({ error: 'Mock error!', status: 400 });
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

    expect(showToast).toHaveBeenCalledWith({
      message: 'Error 400: Mock error!',
      type: 'error',
    });
  });

  it('Handles errors from data fetch.', () => {
    (useSWRQuery as jest.Mock).mockReturnValue({
      error: 'Mock error!',
      isLoading: false,
    });
    render(<RecipientForm />);

    expect(showToast).toHaveBeenCalledWith({
      message: 'An error occurred while fetching data.',
      type: 'error',
    });
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<RecipientForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
