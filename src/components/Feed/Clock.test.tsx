import Clock from './Clock';
import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';

jest.mock('@pqina/flip', () => {
  const mockTimerStop = jest.fn();

  let onupdateCallback: ((val: string) => void) | null = null;

  const mockCounter = {
    timer: { stop: mockTimerStop },
    set onupdate(cb: (val: string) => void) {
      onupdateCallback = cb;
    },
    get onupdate() {
      return onupdateCallback!;
    },
  };

  return {
    __esModule: true,
    default: {
      DOM: {
        create: jest.fn((container, opts) => {
          if (opts && typeof opts.didInit === 'function') {
            opts.didInit(mockTickInstance);
          }
          return mockTickInstance;
        }),
        destroy: jest.fn(),
      },
      count: {
        down: jest.fn(() => mockCounter),
      },
      helper: {
        duration: jest.fn((num, unit) => {
          if (unit === 'years') {
            return num * 365 * 24 * 60 * 60 * 1000;
          }
          return 0;
        }),
      },
    },
  };
});

const mockTickInstance = {
  value: undefined,
  timer: { stop: jest.fn() },
};

describe('Clock Component', () => {
  let Tick: any;

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
    Tick = require('@pqina/flip').default;
  });

  afterEach(() => {
    cleanup();
  });

  it('Renders static text and container elements correctly.', () => {
    render(<Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />);
    expect(screen.getByText(/Ink Runs Dry In/i)).toBeInTheDocument();
    expect(document.querySelector('.tick')).toBeInTheDocument();
  });

  it('Initializes Tick.DOM.create when containerRef is set.', () => {
    render(<Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />);
    expect(Tick.DOM.create).toHaveBeenCalled();
  });

  it('Calls didInit callback and sets tickInstanceRef.current.', () => {
    let didInitCallback: ((instance: any) => void) | null = null;
    Tick.DOM.create.mockImplementation((_: any, opts: any) => {
      didInitCallback = opts.didInit;
      return mockTickInstance;
    });

    render(<Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />);
    expect(didInitCallback).toBeDefined();

    act(() => {
      didInitCallback && didInitCallback(mockTickInstance);
    });

    expect(Tick.DOM.create).toHaveReturnedWith(mockTickInstance);
  });

  it('Creates countdown timer with given earliestSentAtDate.', () => {
    render(<Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />);
    expect(Tick.count.down).toHaveBeenCalled();
    expect(Tick.helper.duration).toHaveBeenCalledWith(1, 'years');
  });

  it('Creates countdown timer with current date if earliestSentAtDate prop is missing.', () => {
    render(<Clock />);
    expect(Tick.count.down).toHaveBeenCalled();
  });

  it('Stops counter.timer.stop on cleanup of countdown effect.', () => {
    const { unmount } = render(
      <Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />,
    );
    unmount();
    const counterInstance = Tick.count.down.mock.results[0].value;
    expect(counterInstance.timer.stop).toHaveBeenCalled();
  });

  it('Does not update tickInstanceRef.current.value if tickValue is undefined.', () => {
    render(<Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />);

    const counterInstance = Tick.count.down.mock.results[0].value;

    act(() => {
      counterInstance.onupdate(undefined as unknown as string);
    });

    expect(mockTickInstance.value).not.toBeDefined();
  });

  it('Does not throw if tickInstanceRef.current is null.', () => {
    Tick.DOM.create.mockReturnValue(null);
    render(<Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />);

    const counterInstance = Tick.count.down.mock.results[0].value;

    act(() => {
      counterInstance.onupdate('00:00:15');
    });
  });

  it('Updates tickInstanceRef.current.value when tickValue is set and tickInstanceRef.current exists.', () => {
    let didInitCallback: ((instance: any) => void) | null = null;

    Tick.DOM.create.mockImplementation((_: any, opts: any) => {
      didInitCallback = opts.didInit;
      return mockTickInstance;
    });

    render(<Clock earliestSentAtDate={new Date('2025-01-01').toISOString()} />);

    act(() => {
      didInitCallback && didInitCallback(mockTickInstance);
    });

    const counterInstance = Tick.count.down.mock.results[0].value;

    act(() => {
      counterInstance.onupdate('00:00:15');
    });

    expect(mockTickInstance.value).toBe('00:00:15');
  });
});
