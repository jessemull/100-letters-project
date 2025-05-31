import { debounce, throttle } from '@util/debounce';

jest.useFakeTimers();

describe('debounce', () => {
  it('Should delay execution until after wait time has passed since the last call.', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 1000);

    debounced('a');
    debounced('b');

    jest.advanceTimersByTime(999);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('Should reset the timer with each call.', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 500);

    debounced('x');
    jest.advanceTimersByTime(300);
    debounced('y');
    jest.advanceTimersByTime(300);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('y');
  });
});

describe('throttle', () => {
  it('Should call immediately on first invocation and ignore subsequent ones during limit.', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 1000);

    throttled('a');
    throttled('b');
    throttled('c');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    jest.advanceTimersByTime(1000);
    throttled('d');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('d');
  });

  it('Should only call throttle once within the limit time.', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);

    throttled();
    jest.advanceTimersByTime(100);
    throttled();
    jest.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(300);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
