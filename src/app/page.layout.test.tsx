import { DesktopMenuContext } from '@contexts/DesktopMenuProvider';
import { render, screen } from '@testing-library/react';
import PageLayout from './page.layout';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('PageLayout', () => {
  it('applies w-80 when collapsed is false', () => {
    render(
      <DesktopMenuContext.Provider
        value={{ collapsed: false, setCollapsed: jest.fn() }}
      >
        <PageLayout>
          <div>Test Content</div>
        </PageLayout>
      </DesktopMenuContext.Provider>,
    );
    const sidebar = screen.getByTestId('menu-width');
    expect(sidebar).toHaveClass('w-80');
  });
});
