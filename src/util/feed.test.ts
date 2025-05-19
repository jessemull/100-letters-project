import { calculateCountdown } from './feed';

describe('calculateCountdown', () => {
  const fixedNow = new Date('2025-05-18T00:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Returns all zeros when target date is in the past.', () => {
    const pastDate = new Date('2025-05-17T12:00:00Z');
    expect(calculateCountdown(pastDate)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('Returns all zeros when target date is now.', () => {
    const nowDate = new Date('2025-05-18T00:00:00Z');
    expect(calculateCountdown(nowDate)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('Calculates correct days/hours/minutes/seconds.', () => {
    const target = new Date('2025-05-19T01:02:03Z'); // +1d 1h 2m 3s
    expect(calculateCountdown(target)).toEqual({
      days: 1,
      hours: 1,
      minutes: 2,
      seconds: 3,
    });
  });

  it('Correctly truncates partial seconds.', () => {
    const target = new Date('2025-05-18T00:00:59.999Z');
    expect(calculateCountdown(target)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 59,
    });
  });
});
