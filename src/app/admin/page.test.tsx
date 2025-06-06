import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Form', () => ({
  __esModule: true,
  SuspenseProgress: () => <div data-testid="suspense-progress">Loading…</div>,
}));

jest.mock('@pages/page.layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

jest.mock('@components/Protected', () => ({
  __esModule: true,
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected">{children}</div>
  ),
}));

describe('AdminPage Component', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('renders Suspense fallback while Admin is loading', async () => {
    jest.doMock('next/dynamic', () => {
      const React = require('react');
      return {
        __esModule: true,
        default: () => React.lazy(() => new Promise(() => {})),
      };
    });

    const { default: AdminPage } = await import('@pages/admin/page');

    render(<AdminPage />);

    expect(await screen.findByTestId('suspense-progress')).toBeInTheDocument();
  });

  it('renders Admin component after loading', async () => {
    jest.doMock('@components/Admin/Admin', () => ({
      __esModule: true,
      default: () => <div data-testid="admin-loaded">Admin Loaded</div>,
    }));

    jest.doMock('next/dynamic', () => {
      const React = require('react');
      return {
        __esModule: true,
        default: (importFn: any, options: any) => {
          const Component = React.lazy(importFn);
          return (props: any) => (
            <Suspense fallback={options.loading()}>
              <Component {...props} />
            </Suspense>
          );
        },
      };
    });

    const { default: AdminPage } = await import('@pages/admin/page');

    render(<AdminPage />);

    expect(await screen.findByTestId('admin-loaded')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });
});
