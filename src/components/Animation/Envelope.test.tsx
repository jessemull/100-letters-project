import React, { ReactNode } from 'react';
import { Envelope } from '@components/Animation';
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
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderWithWidth = (width: number) => {
    return render(<Envelope width={width} />);
  };

  it('Renders the envelope container', async () => {
    await act(async () => {
      renderWithWidth(1024);
    });

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByTestId('envelope')).toBeInTheDocument();
  });

  it('Triggers animations and renders messages after timeouts', async () => {
    renderWithWidth(1024);

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    await waitFor(() => {
      expect(screen.getByTestId('msg-100')).toBeInTheDocument();
      expect(screen.getByTestId('msg-letters')).toBeInTheDocument();
    });
  });

  it.each([
    [100, 'text-xs'],
    [150, 'text-sm'],
    [200, 'text-lg'],
    [300, 'text-2xl'],
    [400, 'text-3xl'],
    [1500, 'text-3xl'],
    [3000, 'text-4xl'],
  ])('Sets correct text size at width %i', async (width, expectedClass) => {
    renderWithWidth(width);

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    const msg = await screen.findByTestId('msg-100');
    expect(msg.parentElement).toHaveClass(expectedClass);
  });
});
