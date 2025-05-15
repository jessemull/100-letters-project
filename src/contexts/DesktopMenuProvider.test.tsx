import React from 'react';
import {
  DesktopMenuContext,
  DesktopMenuProvider,
  useDesktopMenu,
} from '@contexts/DesktopMenuProvider';
import { render, screen, fireEvent } from '@testing-library/react';

const TestComponent = () => {
  const { collapsed, setCollapsed } = useDesktopMenu();

  return (
    <div>
      <p>Collapsed: {collapsed ? 'true' : 'false'}</p>
      <button onClick={() => setCollapsed(!collapsed)}>Toggle</button>
    </div>
  );
};

describe('DesktopMenuProvider', () => {
  it('Provides default value of collapsed = true.', () => {
    render(
      <DesktopMenuProvider>
        <TestComponent />
      </DesktopMenuProvider>,
    );

    expect(screen.getByText(/Collapsed: true/i)).toBeInTheDocument();
  });

  it('Toggles collapsed state when setCollapsed is called.', () => {
    render(
      <DesktopMenuProvider>
        <TestComponent />
      </DesktopMenuProvider>,
    );

    const toggleButton = screen.getByRole('button', { name: /toggle/i });

    expect(screen.getByText(/Collapsed: true/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/Collapsed: false/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByText(/Collapsed: true/i)).toBeInTheDocument();
  });

  it('Throws error if useDesktopMenu is used outside of provider.', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const BrokenComponent = () => {
      useDesktopMenu();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'The useDesktopMenu hook must be used within a DesktopMenuProvider!',
    );

    consoleError.mockRestore();
  });

  it('DesktopMenuContext is defined.', () => {
    expect(DesktopMenuContext).toBeDefined();
  });
});
