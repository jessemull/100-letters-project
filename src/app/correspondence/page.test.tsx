import CorrespondencePage from '@pages/correspondence/page';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@components/Correspondence/CorrespondenceNavigator', () => () => {});

describe('CorrespondencePage Component', () => {
  it('Renders correspondence page.', async () => {
    await act(async () => {
      render(
        <DesktopMenuProvider>
          <CorrespondencePage />
        </DesktopMenuProvider>,
      );
    });
    expect(screen.getAllByText('100 Letters Project').length).toBe(1);
    expect(
      screen.getByText('© 2025 100 Letters Project. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(
        <DesktopMenuProvider>
          <CorrespondencePage />
        </DesktopMenuProvider>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
