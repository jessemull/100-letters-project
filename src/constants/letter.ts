import { LetterMethod, LetterType } from '@ts-types/letter';
import { Status } from '@ts-types/correspondence';

export const methodMap: Record<LetterMethod, string> = {
  [LetterMethod.TYPED]: 'Typed',
  [LetterMethod.HANDWRITTEN]: 'Handwritten',
  [LetterMethod.PRINTED]: 'Printed',
  [LetterMethod.DIGITAL]: 'Digital',
  [LetterMethod.OTHER]: 'Other',
};

export const statusMap: Record<Status, string> = {
  [Status.COMPLETED]: 'Completed',
  [Status.PENDING]: 'Pending',
  [Status.RECEIVED]: 'Received',
  [Status.RESPONDED]: 'Responded',
  [Status.SENT]: 'Sent',
  [Status.UNSENT]: 'Unsent',
};

export const typeMap: Record<LetterType, string> = {
  [LetterType.MAIL]: 'Physical Mail',
  [LetterType.EMAIL]: 'Email',
  [LetterType.SMS]: 'SMS',
  [LetterType.OTHER]: 'Other',
};
