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
    jest.runOnlyPendingTimers();
  });

  it('Triggers animations and renders messages after timeouts', async () => {
    renderWithWidth(1024);

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    await waitFor(() => {
      expect(screen.getByTestId('envelope-heart')).toBeInTheDocument();
    });
    jest.runOnlyPendingTimers();
  });

  it('Does not render envelope if width is undefined.', () => {
    const { container } = render(<Envelope />);
    expect(container.firstChild).toBeNull();
    jest.runOnlyPendingTimers();
  });

  it('Calculates newWidth as 200 when width > 1024.', async () => {
    renderWithWidth(1300);

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    const envelope = await screen.findByTestId('envelope');
    expect(envelope.firstChild).toHaveStyle({ width: '200px' });

    jest.runOnlyPendingTimers();
  });

  it('Calculates newWidth as 100 when width <= 500.', async () => {
    renderWithWidth(400);

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    const envelope = await screen.findByTestId('envelope');
    expect(envelope.firstChild).toHaveStyle({ width: '100px' });

    jest.runOnlyPendingTimers();
  });

  it('Calculates newWidth as 0.3 * width when width < 768 but >= 640.', async () => {
    renderWithWidth(700);

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    const envelope = await screen.findByTestId('envelope');

    expect(envelope.firstChild).toHaveStyle({ width: '150px' });
    jest.runOnlyPendingTimers();
  });

  it('Has no accessibility violations.', async () => {
    jest.useRealTimers();
    const { container } = renderWithWidth(700);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
