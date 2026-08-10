import { formatLetterDates, getLetterDate } from './letter';
import { Letter, LetterMethod, LetterType } from '@ts-types/letter';
import { Status } from '@ts-types/correspondence';

jest.mock('./date-time', () => ({
  toUTCTime: (value: string) => `utc:${value}`,
}));

const baseLetter = {
  correspondenceId: 'c1',
  imageURLs: [],
  letterId: 'l1',
  method: LetterMethod.OTHER,
  status: Status.PENDING,
  text: 'hello',
  title: 'title',
  type: LetterType.MAIL,
} as Letter;

describe('letter utils', () => {
  it('formats sentAt and receivedAt to UTC and drops empty dates', () => {
    const withDates = formatLetterDates({
      ...baseLetter,
      sentAt: '2025-01-01T00:00',
      receivedAt: '2025-01-02T00:00',
    });
    expect(withDates.sentAt).toBe('utc:2025-01-01T00:00');
    expect(withDates.receivedAt).toBe('utc:2025-01-02T00:00');

    const withoutDates = formatLetterDates({
      ...baseLetter,
      sentAt: undefined,
      receivedAt: undefined,
    });
    expect(withoutDates.sentAt).toBeUndefined();
    expect(withoutDates.receivedAt).toBeUndefined();
  });

  it('prefers sentAt, then receivedAt, then No Date', () => {
    expect(
      getLetterDate({
        ...baseLetter,
        sentAt: '2025-07-08T12:00:00.000Z',
      }),
    ).toBe(new Date('2025-07-08T12:00:00.000Z').toLocaleDateString());

    expect(
      getLetterDate({
        ...baseLetter,
        receivedAt: '2025-07-09T12:00:00.000Z',
      }),
    ).toBe(new Date('2025-07-09T12:00:00.000Z').toLocaleDateString());

    expect(getLetterDate(baseLetter)).toBe('No Date');
  });
});
