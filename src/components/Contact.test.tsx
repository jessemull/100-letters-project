import Contact from './Contact';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '../hooks';
import { useForm } from '../hooks/useForm';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../hooks/useForm', () => ({
  useForm: jest.fn(),
}));

jest.mock('../hooks', () => ({
  useSWRMutation: jest.fn(),
}));

describe('Contact', () => {
  const mockPush = jest.fn();
  const mutateMock = jest.fn();
  const updateFieldMock = jest.fn();
  const onSubmitMock = jest.fn();

  const formValues = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useForm as jest.Mock).mockReturnValue({
      errors: {},
      isDirty: true,
      onSubmit: onSubmitMock,
      updateField: updateFieldMock,
      values: formValues,
    });

    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      loading: false,
    });
  });

  it('Renders the contact form with all fields and buttons.', () => {
    render(<Contact />);

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Write your message here...'),
    ).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('Calls updateField on user input.', () => {
    render(<Contact />);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

    expect(updateFieldMock).toHaveBeenCalledWith('firstName', 'Jane');
  });

  it('Calls goHome on Cancel click.', async () => {
    render(<Contact />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('Calls mutate and shows success message on successful submission.', async () => {
    const submitHandler = jest.fn((cb) => cb());
    const values = {
      firstName: 'name',
      lastName: 'name',
      email: 'email@domain.com',
      message: 'message',
    };
    (useForm as jest.Mock).mockReturnValue({
      errors: {},
      isDirty: true,
      onSubmit: submitHandler,
      updateField: updateFieldMock,
      values,
    });

    (useSWRMutation as jest.Mock).mockImplementation((key, options) => {
      return {
        mutate: async (...args: any[]) => {
          await Promise.resolve();
          options?.onSuccess?.();
        },
        loading: false,
      };
    });

    render(<Contact />);

    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(submitHandler).toHaveBeenCalled();

    await waitFor(() =>
      expect(
        screen.getByText("Thanks for your message! We'll be in touch soon."),
      ).toBeInTheDocument(),
    );
  });

  it('Navigates home from the success screen when clicking "Back"', async () => {
    const submitHandler = jest.fn((cb) => cb());
    const values = {
      firstName: 'name',
      lastName: 'name',
      email: 'email@domain.com',
      message: 'message',
    };
    (useForm as jest.Mock).mockReturnValue({
      errors: {},
      isDirty: true,
      onSubmit: submitHandler,
      updateField: updateFieldMock,
      values,
    });

    (useSWRMutation as jest.Mock).mockImplementation((key, options) => {
      return {
        mutate: async (...args: any[]) => {
          await Promise.resolve();
          options?.onSuccess?.();
        },
        loading: false,
      };
    });

    render(<Contact />);

    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(submitHandler).toHaveBeenCalled();

    await waitFor(() =>
      expect(
        screen.getByText("Thanks for your message! We'll be in touch soon."),
      ).toBeInTheDocument(),
    );

    const backButton = await screen.findByText('Back');
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('Shows error if mutation fails.', async () => {
    const submitHandler = jest.fn((cb) => cb());
    (useForm as jest.Mock).mockReturnValue({
      errors: {},
      isDirty: true,
      onSubmit: submitHandler,
      updateField: updateFieldMock,
      values: formValues,
    });

    mutateMock.mockRejectedValueOnce(new Error('Server error'));

    render(<Contact />);

    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mutateMock).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByText('Something went wrong! Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('Disables the submit button when form is not dirty or has errors.', () => {
    (useForm as jest.Mock).mockReturnValue({
      errors: { email: ['Invalid email'] },
      isDirty: false,
      onSubmit: onSubmitMock,
      updateField: updateFieldMock,
      values: formValues,
    });

    render(<Contact />);

    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('Calls updateField for each input field when changed.', () => {
    render(<Contact />);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    expect(updateFieldMock).toHaveBeenCalledWith('firstName', 'Jane');

    const lastNameInput = screen.getByPlaceholderText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    expect(updateFieldMock).toHaveBeenCalledWith('lastName', 'Doe');

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'jane@doe.com' } });
    expect(updateFieldMock).toHaveBeenCalledWith('email', 'jane@doe.com');

    const messageInput = screen.getByPlaceholderText(
      'Write your message here...',
    );
    fireEvent.change(messageInput, { target: { value: 'Hello there!' } });
    expect(updateFieldMock).toHaveBeenCalledWith('message', 'Hello there!');
  });

  it('Shows error if onError handler is called.', async () => {
    const submitHandler = jest.fn((cb) => cb());
    (useForm as jest.Mock).mockReturnValue({
      errors: {},
      isDirty: true,
      onSubmit: submitHandler,
      updateField: updateFieldMock,
      values: formValues,
    });

    (useSWRMutation as jest.Mock).mockImplementation((key, options) => {
      return {
        mutate: async () => {
          await Promise.resolve();
          options?.onError?.(new Error('onError triggered'));
        },
        loading: false,
      };
    });

    render(<Contact />);

    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() =>
      expect(
        screen.getByText('Something went wrong! Please try again.'),
      ).toBeInTheDocument(),
    );
  });
});
