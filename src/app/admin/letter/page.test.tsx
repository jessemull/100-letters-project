import LetterPage from './page';
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';

jest.mock('@contexts/AuthProvider', () => ({
  useAuth: jest.fn().mockReturnValue({
    authenticating: false,
    isLoggedIn: true,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    replace: jest.fn(),
  }),
}));

jest.mock('@components/Admin/Letters/LetterForm', () => {
  const MockForm = () => <div data-testid="letter-form" />;
  MockForm.displayName = 'MockForm';
  return MockForm;
});

jest.mock('../../page.layout', () => {
  const MockLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  );
  MockLayout.displayName = 'MockLayout';
  return MockLayout;
});

jest.mock('@components/Form', () => {
  const Progress = ({ size, color }: { size: number; color: string }) => (
    <div data-testid="progress" data-size={size} data-color={color}>
      Loading...
    </div>
  );
  Progress.displayName = 'MockProgress';
  return { Progress };
});

describe('LetterPage Component', () => {
  it('Renders the letter form.', async () => {
    render(
      <DesktopMenuProvider>
        <LetterPage />
      </DesktopMenuProvider>,
    );
    expect(screen.getByTestId('letter-form')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    await act(async () => {
      const rendered = render(
        <DesktopMenuProvider>
          <LetterPage />
        </DesktopMenuProvider>,
      );
      const results = await axe(rendered.container!);
      expect(results).toHaveNoViolations();
    });
  });
});
