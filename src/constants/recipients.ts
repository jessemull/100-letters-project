import { Recipient } from '@ts-types/recipients';
import { required } from '@util/validators';

export const initialRecipientValues: Recipient = {
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
};

export const recipientValidators = {
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
};
