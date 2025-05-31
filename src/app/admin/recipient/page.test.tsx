import RecipientPage from '@pages/admin/recipient/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
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
    authenticating: false,
    isLoggedIn: true,
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

describe('RecipientPage Component', () => {
  it('Renders recipient page.', async () => {
    await act(async () => {
      render(
        <DesktopMenuProvider>
          <RecipientPage />
        </DesktopMenuProvider>,
      );
    });
    expect(screen.getByText('Recipient Form')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    await act(async () => {
      const rendered = render(
        <DesktopMenuProvider>
          <RecipientPage />
        </DesktopMenuProvider>,
      );
      const results = await axe(rendered.container!);
      expect(results).toHaveNoViolations();
    });
  });
});
