import { maxLength, required } from '@util/validators';

export const defaultLoginError = 'Error signing in. Please try again.';

export const initialLoginValues = {
  password: '',
  username: '',
};

export const loginValidators = {
  password: [
    required('Please enter a password'),
    maxLength(150, 'Maximum password length exceeded'),
  ],
  username: [
    required('Please enter a user name'),
    maxLength(150, 'Maximum user name length exceeded'),
  ],
};
