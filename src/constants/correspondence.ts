import {
  Category,
  CorrespondenceUpdate,
  Status,
} from '@ts-types/correspondence';
import { required } from '@util/validators';

export const correspondenceStatusOptions = [
  { label: 'Completed', value: Status.COMPLETED },
  { label: 'Pending', value: Status.PENDING },
  { label: 'Responded', value: Status.RESPONDED },
  { label: 'Unsent', value: Status.UNSENT },
];

export const correspondenceCategoryOptions = [
  { label: 'Comedy', value: Category.COMEDY },
  { label: 'Entertainment', value: Category.ENTERTAINMENT },
  { label: 'Family', value: Category.FAMILY },
  { label: 'Food', value: Category.FOOD },
  { label: 'Friends', value: Category.FRIENDS },
  { label: 'Journalism', value: Category.JOURNALISM },
  { label: 'Literature', value: Category.LITERATURE },
  { label: 'Mentors', value: Category.MENTORS },
  { label: 'Music', value: Category.MUSIC },
  { label: 'Science', value: Category.SCIENCE },
  { label: 'Sports', value: Category.SPORTS },
  { label: 'Technology', value: Category.TECHNOLOGY },
];

export const categoryLabelMap: Record<Category, string> = {
  [Category.COMEDY]: 'Comedy',
  [Category.ENTERTAINMENT]: 'Entertainment',
  [Category.FAMILY]: 'Family',
  [Category.FOOD]: 'Food',
  [Category.FRIENDS]: 'Friends',
  [Category.JOURNALISM]: 'Journalism',
  [Category.LITERATURE]: 'Literature',
  [Category.MENTORS]: 'Mentors',
  [Category.MUSIC]: 'Music',
  [Category.SCIENCE]: 'Science',
  [Category.SPORTS]: 'Sports',
  [Category.TECHNOLOGY]: 'Technology',
};

export const correspondenceStatusLabelMap: Record<Status, string> = {
  [Status.COMPLETED]: 'Completed',
  [Status.PENDING]: 'Pending',
  [Status.RECEIVED]: 'Received',
  [Status.RESPONDED]: 'Responded',
  [Status.SENT]: 'Sent',
  [Status.UNSENT]: 'Unsent',
};

export const initialCorrespondenceValues: CorrespondenceUpdate = {
  correspondenceId: '',
  letters: [],
  recipient: {
    address: {
      city: '',
      country: '',
      postalCode: '',
      state: '',
      street: '',
    },
    description: '',
    firstName: '',
    lastName: '',
    occupation: '',
    organization: '',
    recipientId: '',
  },
  recipientId: '',
  reason: {
    category: Category.TECHNOLOGY,
    description: '',
  },
  status: Status.UNSENT,
  title: '',
};

export const correspondenceValidators = {
  reason: {
    category: [required('Category required')],
    description: [required('Description required')],
  },
  recipient: {
    address: {
      city: [required('City required')],
      country: [required('Country required')],
      postalCode: [required('Postal code required')],
      state: [required('State required')],
      street: [required('Street required')],
    },
    description: [required('Description required')],
    firstName: [required('First name required')],
    lastName: [required('Last name required')],
    occupation: [required('Occupation required')],
    organization: [required('Organization required')],
  },
  status: [required('Status required')],
  title: [required('Title required')],
};
