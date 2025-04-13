import { Contact } from '@components/Contact';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { axe } from 'jest-axe';
import { useForm } from '@hooks/useForm';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';

jest.mock('@hooks/useForm', () => ({
  useForm: jest.fn(),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn(),
}));

jest.mock('@hooks/useForm', () => ({
  useForm: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: ({ onChange }: any) => {
    return (
      <button
        aria-label="Mock reCAPTCHA"
        data-testid="recaptcha"
        onClick={() => onChange('dummy-captcha-token')}
        type="button"
      />
    );
  },
}));

describe('Contact Component', () => {
  const mockPush = jest.fn();

  const useSWRMutationMock = (key: any, config: any = {}) => {
    return {
      loading: false,
      mutate: async (data: any) => {
        const result = { success: true };
        if (config?.onSuccess) {
          config.onSuccess(result, data, null);
        }
        if (config?.onError) {
          config.onError(result, data, null);
        }
        return result;
      },
    };
  };

  const useFormMock = () => {
    let values = { firstName: '', lastName: '', email: '', message: '' };

    const updateField = jest.fn((field, value) => {
      values = { ...values, [field]: value };
    });

    return {
      errors: {},
      isDirty: true,
      onSubmit: jest.fn().mockImplementation((fxn) => fxn()),
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
    (useSWRMutation as jest.Mock).mockImplementation(useSWRMutationMock);
  });

  it('Renders the contact form correctly.', () => {
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
    const { container } = render(<Contact />);

    const firstNameInput = container.querySelector('#firstName') as Element;
    const lastNameInput = container.querySelector('#lastName') as Element;
    const emailInput = container.querySelector('#email') as Element;
    const messageInput = container.querySelector('#message') as Element;

    await fireEvent.input(firstNameInput, { target: { value: 'John' } });
    await fireEvent.input(lastNameInput, { target: { value: 'Doe' } });
    await fireEvent.input(emailInput, {
      target: { value: 'john.doe@example.com' },
    });
    await fireEvent.input(messageInput, { target: { value: 'Hello' } });

    fireEvent.click(screen.getByTestId('recaptcha'));

    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(`Thanks for your message! We'll be in touch soon.`),
      ).toBeInTheDocument();
    });
  });

  it('Shows error message when mutation fails.', async () => {
    const errorMessage = 'Something went wrong! Please try again.';

    (useSWRMutation as jest.Mock).mockImplementation(() => ({
      loading: false,
      mutate: async () => {
        throw new Error('Mutation failed');
      },
    }));

    render(<Contact />);

    fireEvent.input(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.input(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.input(screen.getByPlaceholderText('Email'), {
      target: { value: 'jane.doe@example.com' },
    });
    fireEvent.input(screen.getByPlaceholderText('Write your message here...'), {
      target: { value: 'This is a message' },
    });

    fireEvent.click(screen.getByTestId('recaptcha'));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('Handles captcha token change correctly.', async () => {
    render(<Contact />);

    fireEvent.click(screen.getByTestId('recaptcha'));

    expect(
      screen.queryByText('Please complete the CAPTCHA.'),
    ).not.toBeInTheDocument();
  });

  it('Navigates to home when cancel button is clicked.', async () => {
    render(<Contact />);

    const cancelButton = screen.getByText('Cancel');
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('Renders email validation error.', () => {
    (useForm as jest.Mock).mockReturnValue({
      errors: {
        email: ['Please enter a valid e-mail address'],
      },
      isDirty: true,
      onSubmit: jest.fn().mockImplementation((fxn) => fxn()),
      updateField: jest.fn(),
      values: {
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      },
    });

    render(<Contact />);
    expect(
      screen.getByText('Please enter a valid e-mail address'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Contact />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
