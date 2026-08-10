export const debounce = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
): ((...args: TArgs) => void) => {
  let timer: NodeJS.Timeout;
  return (...args: TArgs) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const throttle = <TArgs extends unknown[], TResult>(
  func: (...args: TArgs) => TResult,
  limit: number,
): ((...args: TArgs) => TResult | undefined) => {
  let inThrottle = false;
  let lastResult: TResult | undefined;
  return (...args: TArgs): TResult | undefined => {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
      lastResult = func(...args);
    }
    return lastResult;
  };
};
