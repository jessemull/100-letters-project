import RecipientPage from '@pages/admin/recipient/page';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    back: jest.fn(),
  }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
}));

jest.mock('@contexts/AuthProvider', () => ({
  useAuth: jest.fn().mockReturnValue({
    loading: false,
    token: 'test-token',
  }),
}));

jest.mock('@hooks/useSWRQuery', () => ({
  useSWRQuery: jest.fn().mockReturnValue({
    data: { data: {} },
    isLoading: false,
  }),
}));

jest.mock('@hooks/useSWRMutation', () => ({
  useSWRMutation: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('@hooks/useForm', () => {
  const initial = {
    address: {
      city: '',
      country: '',
      postalCode: '',
      state: '',
      street: '',
    },
    description: '',
    firstName: '',
    lastName: '',
    occupation: '',
    organization: '',
    recipientId: '',
  };
  return {
    useForm: () => ({
      values: initial,
      errors: {},
      isDirty: false,
      onSubmit: jest.fn(),
      updateField: jest.fn(),
      setValues: jest.fn(),
    }),
  };
});

describe('RecipientPage', () => {
  it('Renders recipient page.', async () => {
    await act(async () => {
      render(<RecipientPage />);
    });
    expect(screen.getByText('Recipient Form')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    let container: HTMLElement;
    await act(async () => {
      const rendered = render(<RecipientPage />);
      container = rendered.container;
      const results = await axe(container!);
      expect(results).toHaveNoViolations();
    });
  });
});
