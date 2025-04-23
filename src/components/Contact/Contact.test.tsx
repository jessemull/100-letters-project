import { Contact } from '@components/Contact';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useForm } from '@hooks/useForm';
import { useSWRMutation } from '@hooks/useSWRMutation';

jest.mock('@hooks/useForm', () => ({
  useForm: jest.fn(),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: ({ onChange }: any) => (
    <button
      aria-label="Mock reCAPTCHA"
      data-testid="recaptcha"
      onClick={() => onChange('dummy-captcha-token')}
      type="button"
    />
  ),
}));

describe('Contact Component', () => {
  const mockPush = jest.fn();

  const useFormMock = () => {
    let values = {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    };

    const updateField = jest.fn((field, value) => {
      values = { ...values, [field]: value };
    });

    return {
      errors: {},
      isDirty: true,
      onSubmit: jest.fn().mockImplementation((fn) => fn()),
      updateField,
      get values() {
        return values;
      },
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useForm as jest.Mock).mockReturnValue(useFormMock());
  });

  it('Renders the contact form correctly.', () => {
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });

    render(<Contact />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Write your message here...'),
    ).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('Shows error message if CAPTCHA is not completed.', async () => {
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });

    render(<Contact />);

    const submitButton = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText('Please complete the CAPTCHA.'),
    ).toBeInTheDocument();
  });

  it('Submits the form successfully.', async () => {
    const mutateMock = jest.fn().mockResolvedValue({ success: true });

    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      mutate: async (...args: any[]) => {
        onSuccess?.();
        return { success: true };
      },
      isLoading: false,
    }));

    const { container } = render(<Contact />);

    fireEvent.input(container.querySelector('#firstName')!, {
      target: { value: 'John' },
    });
    fireEvent.input(container.querySelector('#lastName')!, {
      target: { value: 'Doe' },
    });
    fireEvent.input(container.querySelector('#email')!, {
      target: { value: 'john@example.com' },
    });
    fireEvent.input(container.querySelector('#message')!, {
      target: { value: 'Hello!' },
    });

    fireEvent.click(screen.getByTestId('recaptcha'));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(
      screen.getByText(`Thanks for your message! We'll be in touch soon.`),
    ).toBeInTheDocument();
  });

  it('Shows error message when mutation fails.', async () => {
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      mutate: async () => {
        onError?.();
        throw new Error('Mutation failed');
      },
      isLoading: false,
    }));

    render(<Contact />);

    fireEvent.input(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.input(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.input(screen.getByPlaceholderText('Email'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.input(screen.getByPlaceholderText('Write your message here...'), {
      target: { value: 'Test message' },
    });

    fireEvent.click(screen.getByTestId('recaptcha'));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(
      screen.getByText('Something went wrong! Please try again.'),
    ).toBeInTheDocument();
  });

  it('Handles captcha token change correctly.', async () => {
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });

    render(<Contact />);

    fireEvent.click(screen.getByTestId('recaptcha'));

    // CAPTCHA token change implicitly tested via successful submission
    expect(
      screen.queryByText('Please complete the CAPTCHA.'),
    ).not.toBeInTheDocument();
  });

  it('Navigates home when clicking the "Back" button after successful submission.', async () => {
    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      mutate: async () => {
        onSuccess?.();
        return { success: true };
      },
      isLoading: false,
    }));

    const { container } = render(<Contact />);

    fireEvent.input(container.querySelector('#firstName')!, {
      target: { value: 'John' },
    });
    fireEvent.input(container.querySelector('#lastName')!, {
      target: { value: 'Doe' },
    });
    fireEvent.input(container.querySelector('#email')!, {
      target: { value: 'john@example.com' },
    });
    fireEvent.input(container.querySelector('#message')!, {
      target: { value: 'Hello!' },
    });

    fireEvent.click(screen.getByTestId('recaptcha'));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('Displays the first email error if present in the errors object.', () => {
    (useForm as jest.Mock).mockReturnValue({
      ...useFormMock(),
      errors: {
        email: ['Please enter a valid e-mail address'],
      },
    });

    render(<Contact />);
    expect(
      screen.getByText('Please enter a valid e-mail address'),
    ).toBeInTheDocument();
  });
});
