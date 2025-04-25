import { toDateTimeLocal, toUTCTime } from '@util/date-time';

describe('toDateTimeLocal', () => {
  it('converts ISO string to local datetime format', () => {
    const iso = '2024-01-01T12:00:00.000Z';
    const result = toDateTimeLocal(iso);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it('returns an empty string if input is empty', () => {
    expect(toDateTimeLocal('')).toBe('');
  });
});

describe('toUTCTime', () => {
  it('converts a date string to UTC ISO format', () => {
    const local = '2024-01-01T12:00';
    const result = toUTCTime(local);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it('returns empty string if input is empty', () => {
    expect(toUTCTime('')).toBe('');
  });

  it('handles invalid date strings gracefully', () => {
    const invalid = 'abc123';
    expect(() => toUTCTime(invalid)).toThrow();
  });
});
