import { isEmail, maxLength, required } from '@util/validators';

export const defaultContactError = 'Something went wrong! Please try again.';

export const initialContactValues = {
  email: '',
  firstName: '',
  lastName: '',
  message: '',
};

export const contactValidators = {
  firstName: [required('Please enter a first name')],
  lastName: [required('Please enter a last name')],
  email: [
    required('Please enter an e-mail address'),
    isEmail('Please enter a valid e-mail address'),
  ],
  message: [
    required('Please enter a message'),
    maxLength(1500, 'Length must be less than 1500 characters'),
  ],
};
