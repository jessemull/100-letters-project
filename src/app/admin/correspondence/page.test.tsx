import CorrespondencePage from './page';
import React, { act } from 'react';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

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

jest.mock('@components/Admin/Correspondences/CorrespondenceForm', () => {
  const MockForm = () => <div data-testid="correspondence-form" />;
  MockForm.displayName = 'MockCorrespondenceForm';
  return MockForm;
});

jest.mock('../../page.layout', () => {
  const MockLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  );
  MockLayout.displayName = 'MockPageLayout';
  return MockLayout;
});

describe('CorrespondencePage Component', () => {
  it('Renders the correspondence form.', async () => {
    render(
      <DesktopMenuProvider>
        <CorrespondencePage />
      </DesktopMenuProvider>,
    );
    expect(screen.getByTestId('correspondence-form')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    await act(async () => {
      const rendered = render(
        <DesktopMenuProvider>
          <CorrespondencePage />
        </DesktopMenuProvider>,
      );
      const results = await axe(rendered.container!);
      expect(results).toHaveNoViolations();
    });
  });
});
