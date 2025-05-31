import { Status } from '@ts-types/correspondence';
import { Letter, LetterMethod, LetterType, View } from '@ts-types/letter';
import { required } from '@util/validators';

export const letterViewToLabel = {
  [View.LETTER_FRONT]: 'Letter Front',
  [View.LETTER_BACK]: 'Letter Back',
  [View.ENVELOPE_FRONT]: 'Envelope Front',
  [View.ENVELOPE_BACK]: 'Envelope Back',
  [View.OTHER]: 'Other',
};

export const letterMethodOptions = [
  { label: 'Digital', value: LetterMethod.DIGITAL },
  { label: 'Handwritten', value: LetterMethod.HANDWRITTEN },
  { label: 'Printed', value: LetterMethod.PRINTED },
  { label: 'Typed', value: LetterMethod.TYPED },
  { label: 'Other', value: LetterMethod.OTHER },
];

export const letterTypeOptions = [
  { label: 'Email', value: LetterType.EMAIL },
  { label: 'Mail', value: LetterType.MAIL },
  { label: 'SMS', value: LetterType.SMS },
  { label: 'Other', value: LetterType.OTHER },
];

export const letterStatusOptions = [
  { label: 'Pending', value: Status.PENDING },
  { label: 'Responded', value: Status.RESPONDED },
  { label: 'Sent', value: Status.SENT },
  { label: 'Received', value: Status.RECEIVED },
];

export const letterViewOptions = [
  { label: 'Letter Front', value: View.LETTER_FRONT },
  { label: 'Letter Back', value: View.LETTER_BACK },
  { label: 'Envelope Front', value: View.ENVELOPE_FRONT },
  { label: 'Envelope Back', value: View.ENVELOPE_BACK },
  { label: 'Other', value: View.OTHER },
];

export const initialLetterValues: Letter = {
  correspondenceId: '',
  description: '',
  imageURLs: [],
  letterId: '',
  method: LetterMethod.HANDWRITTEN,
  receivedAt: '',
  sentAt: '',
  status: Status.PENDING,
  text: '',
  title: '',
  type: LetterType.MAIL,
};

export const letterValidators = {
  correspondenceId: [required('Correspondence ID required')],
  method: [required('Method required')],
  status: [required('Status required')],
  text: [required('Text required')],
  title: [required('Title required')],
  type: [required('Type required')],
};
