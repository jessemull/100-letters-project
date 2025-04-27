import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CorrespondenceForm } from '@components/Admin'; // Adjust path as needed
import { useAuth } from '@contexts/AuthProvider';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { showToast } from '@components/Form';
import { useSearchParams } from 'next/navigation';
import { RecipientFactory } from '@factories/recipient';
import { useRouter } from 'next/navigation';

jest.mock('@contexts/AuthProvider');
jest.mock('@hooks/useSWRQuery');
jest.mock('@hooks/useSWRMutation');
jest.mock('../../Form/Toast', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
describe('CorrespondenceForm', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      loading: false,
      token: 'mockToken',
    });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: { correspondence: {}, recipient: {}, letters: [] },
      error: null,
      isLoading: false,
    });
    (useSWRMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });
  });

  it('Renders the form correctly.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn() });

    render(<CorrespondenceForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/domain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/impact/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/description/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('Calls handleSubmit on form submit.', async () => {
    const mockMutate = jest.fn();
    const back = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back });
    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onSuccess?.();
        mockMutate({ body });
      },
    }));
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('correspondenceId'),
    });

    render(<CorrespondenceForm />);

    const descriptions = screen.getAllByLabelText(/description/i);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText(/domain/i), {
      target: { value: 'Domain' },
    });
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: 'UNSENT' },
    });
    fireEvent.change(screen.getByLabelText(/impact/i), {
      target: { value: 'HIGH' },
    });
    fireEvent.change(descriptions[0], { target: { value: 'Description...' } });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Norm' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'McDonald' },
    });
    fireEvent.change(screen.getByLabelText(/organization/i), {
      target: { value: 'Sera' },
    });
    fireEvent.change(screen.getByLabelText(/occupation/i), {
      target: { value: 'Architect' },
    });
    fireEvent.change(descriptions[1], { target: { value: 'Description...' } });

    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: '123 Fake Street' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Provo' },
    });
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '839292' },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'UT' },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'USA' },
    });

    fireEvent.click(screen.getByDisplayValue('Update'));

    await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(1));
  });

  it('Shows error toast on mutation error with default message.', async () => {
    const mockMutate = jest.fn().mockReturnValue({});
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onError?.({});
        mockMutate({ body });
      },
    }));
    (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn() });

    render(<CorrespondenceForm />);

    const descriptions = screen.getAllByLabelText(/description/i);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText(/domain/i), {
      target: { value: 'Domain' },
    });
    fireEvent.change(descriptions[0], { target: { value: 'Description...' } });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Norm' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'McDonald' },
    });
    fireEvent.change(screen.getByLabelText(/organization/i), {
      target: { value: 'Sera' },
    });
    fireEvent.change(screen.getByLabelText(/occupation/i), {
      target: { value: 'Architect' },
    });
    fireEvent.change(descriptions[1], { target: { value: 'Description...' } });

    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: '123 Fake Street' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Provo' },
    });
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '839292' },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'UT' },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'USA' },
    });

    fireEvent.click(screen.getByDisplayValue('Create'));

    await waitFor(() =>
      expect(showToast).toHaveBeenCalledWith({
        message: 'An error occurred during data update.',
        type: 'error',
      }),
    );
  });

  it('Shows error toast on mutation error.', async () => {
    const mockMutate = jest.fn().mockReturnValue({});
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      isLoading: false,
      mutate: async ({ body }: any) => {
        onError?.({ error: 'Bad update', status: 400 });
        mockMutate({ body });
      },
    }));
    (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn() });

    render(<CorrespondenceForm />);

    const descriptions = screen.getAllByLabelText(/description/i);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText(/domain/i), {
      target: { value: 'Domain' },
    });
    fireEvent.change(descriptions[0], { target: { value: 'Description...' } });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Norm' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'McDonald' },
    });
    fireEvent.change(screen.getByLabelText(/organization/i), {
      target: { value: 'Sera' },
    });
    fireEvent.change(screen.getByLabelText(/occupation/i), {
      target: { value: 'Architect' },
    });
    fireEvent.change(descriptions[1], { target: { value: 'Description...' } });

    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: '123 Fake Street' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Provo' },
    });
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '839292' },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'UT' },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'USA' },
    });

    fireEvent.click(screen.getByDisplayValue('Create'));

    await waitFor(() =>
      expect(showToast).toHaveBeenCalledWith({
        message: 'Error 400: Bad update',
        type: 'error',
      }),
    );
  });

  it('Displays loading spinner when fetching data.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn() });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: {},
      error: null,
      isLoading: true,
    });

    render(<CorrespondenceForm />);

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Renders letters and handles letter actions.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('correspondenceId'),
    });
    const letters = [
      { letterId: '1', title: 'Letter 1' },
      { letterId: '2', title: 'Letter 2' },
    ];
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: {
          correspondence: {
            correspondenceId: 'correspondenceId',
            description: 'description',
            status: 'RESPONDED',
            reason: {
              description: 'description',
              domain: 'domain',
              impact: 'HIGH',
            },
            title: 'title',
          },
          letters,
          recipient: RecipientFactory.build(),
        },
      },
      error: null,
      isLoading: false,
    });

    render(<CorrespondenceForm />);

    expect(screen.getByText('Letter 1')).toBeInTheDocument();
    expect(screen.getByText('Letter 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/add letter/i));
    await waitFor(() => {
      expect(push).toHaveBeenCalled();
    });
  });

  it('Handles confirmation modal open/close for letter delete.', async () => {
    const mockMutate = jest.fn();
    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      isLoading: false,
      mutate: async ({ body, params, path }: any) => {
        onSuccess?.({ body, params, path });
        mockMutate({ body, params, path });
      },
    }));
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('correspondenceId'),
    });
    const letters = [{ letterId: '1', title: 'Letter 1' }];
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: {
          correspondence: {
            description: 'description',
            status: 'RESPONDED',
            reason: {
              description: 'description',
              domain: 'domain',
              impact: 'HIGH',
            },
            title: 'title',
          },
          letters,
          recipient: RecipientFactory.build(),
        },
      },
      error: null,
      isLoading: false,
    });

    render(<CorrespondenceForm />);

    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        path: `/letter/1`,
        params: { correspondenceId: 'correspondenceId', letterId: '1' },
      });
    });
  });

  it('Show error toast for failed letter delete.', async () => {
    const mockMutate = jest.fn();
    (useSWRMutation as jest.Mock).mockImplementation(({ onError }) => ({
      isLoading: false,
      mutate: async ({ body, params, path }: any) => {
        onError?.({ error: 'Mock error!' });
        mockMutate({ body, params, path });
      },
    }));
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('correspondenceId'),
    });
    const letters = [{ letterId: '1', title: 'Letter 1' }];
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: {
          correspondence: {
            description: 'description',
            status: 'RESPONDED',
            reason: {
              description: 'description',
              domain: 'domain',
              impact: 'HIGH',
            },
            title: 'title',
          },
          letters,
          recipient: RecipientFactory.build(),
        },
      },
      error: null,
      isLoading: false,
    });

    render(<CorrespondenceForm />);

    fireEvent.click(screen.getByTestId('delete-button'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Mock error!',
          type: 'error',
        }),
      );
    });
  });

  it('Shows loading spinner on delete.', async () => {
    const mockMutate = jest.fn();
    (useSWRMutation as jest.Mock).mockImplementation(({ onSuccess }) => ({
      isLoading: true,
      mutate: async ({ body, params, path }: any) => {
        onSuccess?.({ body, params, path });
        mockMutate({ body, params, path });
      },
    }));
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('correspondenceId'),
    });
    const letters = [{ letterId: '1', title: 'Letter 1' }];
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: {
          correspondence: {
            description: 'description',
            status: 'RESPONDED',
            reason: {
              description: 'description',
              domain: 'domain',
              impact: 'HIGH',
            },
            title: 'title',
          },
          letters,
          recipient: RecipientFactory.build(),
        },
      },
      error: null,
      isLoading: false,
    });

    render(<CorrespondenceForm />);

    await waitFor(() => {
      expect(screen.getAllByTestId('progress').length).toBeGreaterThan(0);
    });
  });

  it('Should navigate back on cancel.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('correspondenceId'),
    });
    const letters = [
      { letterId: '1', title: 'Letter 1' },
      { letterId: '2', title: 'Letter 2' },
    ];
    const back = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: {
          correspondence: {
            description: 'description',
            status: 'RESPONDED',
            reason: {
              description: 'description',
              domain: 'domain',
              impact: 'HIGH',
            },
            title: 'title',
          },
          letters,
          recipient: RecipientFactory.build(),
        },
      },
      error: null,
      isLoading: false,
    });

    render(<CorrespondenceForm />);

    fireEvent.click(screen.getByText(/cancel/i));

    await waitFor(() => {
      expect(back).toHaveBeenCalled();
    });
  });

  it('Should navigate to letter form on edit.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('correspondenceId'),
    });
    const letters = [{ letterId: '1', title: 'Letter 1' }];
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: {
          correspondence: {
            description: 'description',
            status: 'RESPONDED',
            reason: {
              description: 'description',
              domain: 'domain',
              impact: 'HIGH',
            },
            title: 'title',
          },
          letters,
          recipient: RecipientFactory.build(),
        },
      },
      error: null,
      isLoading: false,
    });

    render(<CorrespondenceForm />);

    fireEvent.click(screen.getByTestId('edit-button'));

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
    });
  });

  it('Shows toast if fetch error occurs.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'correspondenceId',
    });

    (useSWRQuery as jest.Mock).mockImplementation(() => {
      return {
        error: { info: { message: 'Bad fetch' } },
        isLoading: false,
      };
    });

    render(<CorrespondenceForm />);

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Bad fetch',
        type: 'error',
      }),
    );
  });

  it('Shows toast if fetch error occurs with default message.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => 'correspondenceId',
    });

    (useSWRQuery as jest.Mock).mockImplementation(() => {
      return {
        error: { info: {} },
        isLoading: false,
      };
    });

    render(<CorrespondenceForm />);

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'An error occurred while fetching data.',
        type: 'error',
      }),
    );
  });
});
