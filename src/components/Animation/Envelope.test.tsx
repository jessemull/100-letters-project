import React, { ReactNode } from 'react';
import { Envelope } from '@components/Animation';
import { axe } from 'jest-axe';
import { render, screen, waitFor, act } from '@testing-library/react';

jest.mock('framer-motion', () => ({
  __esModule: true,
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: { children: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('Envelope Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  const renderWithWidth = async (width: number) => {
    setWindowWidth(width);
    await act(async () => {
      render(<Envelope />);
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
  };

  it('Renders the envelope container.', async () => {
    await renderWithWidth(1024);
    expect(screen.getByTestId('envelope')).toBeInTheDocument();
  });

  it('Triggers animations and renders messages after timeouts.', async () => {
    await renderWithWidth(1024);
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    await waitFor(() => {
      expect(screen.getByTestId('envelope-heart')).toBeInTheDocument();
    });
  });

  it('Sets correct width to 200 when window width > 1024.', async () => {
    await renderWithWidth(1200);
    const container = screen.getByTestId('envelope').firstChild as HTMLElement;
    expect(container).toHaveStyle({ width: '200px' });
  });

  it('Sets correct width to 150 when window width is between 501 and 1024.', async () => {
    await renderWithWidth(700);
    const container = screen.getByTestId('envelope').firstChild as HTMLElement;
    expect(container).toHaveStyle({ width: '150px' });
  });

  it('Sets correct width to 100 when window width <= 500.', async () => {
    await renderWithWidth(400);
    const container = screen.getByTestId('envelope').firstChild as HTMLElement;
    expect(container).toHaveStyle({ width: '100px' });
  });

  it('Responds to window resize after mount.', async () => {
    await renderWithWidth(1200);
    let container = screen.getByTestId('envelope').firstChild as HTMLElement;
    expect(container).toHaveStyle({ width: '200px' });

    await act(() => {
      setWindowWidth(400);
    });

    await waitFor(() => {
      container = screen.getByTestId('envelope').firstChild as HTMLElement;
      expect(container).toHaveStyle({ width: '100px' });
    });
  });

  it('Has no accessibility violations.', async () => {
    jest.useRealTimers();
    const { container } = render(<Envelope />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
