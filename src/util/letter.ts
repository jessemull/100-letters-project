import { Letter } from '@ts-types/letter';
import { toUTCTime } from './date-time';

export const formatLetterDates = (values: Letter): Letter => {
  const formatted = { ...values };

  if (formatted.sentAt) {
    formatted.sentAt = toUTCTime(formatted.sentAt);
  } else {
    delete formatted.sentAt;
  }

  if (formatted.receivedAt) {
    formatted.receivedAt = toUTCTime(formatted.receivedAt);
  } else {
    delete formatted.receivedAt;
  }

  return formatted;
};

export const getLetterDate = (letter: Letter) => {
  if (letter.sentAt) return new Date(letter.sentAt).toLocaleDateString();
  if (letter.receivedAt)
    return new Date(letter.receivedAt).toLocaleDateString();
  return 'No Date';
};
