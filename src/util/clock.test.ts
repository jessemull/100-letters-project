import { pad, formatTime } from '@util/clock';

describe('pad', () => {
  it('Pads single digit numbers with leading zero.', () => {
    expect(pad(0)).toBe('00');
    expect(pad(5)).toBe('05');
    expect(pad(9)).toBe('09');
  });

  it('Does not pad numbers with two or more digits.', () => {
    expect(pad(10)).toBe('10');
    expect(pad(99)).toBe('99');
    expect(pad(123)).toBe('123');
  });
});

describe('formatTime', () => {
  it('Returns zeroed time parts for negative or zero input.', () => {
    expect(formatTime(0)).toEqual({
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    });
    expect(formatTime(-1000)).toEqual({
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    });
  });

  it('Correctly formats milliseconds to days, hours, minutes, and seconds.', () => {
    expect(formatTime(1000)).toEqual({
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '01',
    });

    expect(formatTime(90000)).toEqual({
      days: '00',
      hours: '00',
      minutes: '01',
      seconds: '30',
    });

    expect(formatTime(3723000)).toEqual({
      days: '00',
      hours: '01',
      minutes: '02',
      seconds: '03',
    });

    expect(formatTime(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000)).toEqual({
      days: '02',
      hours: '03',
      minutes: '04',
      seconds: '05',
    });
  });
});
