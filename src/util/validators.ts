import { Validator } from '../types';

export const required =
  (message: string): Validator =>
  (value) => {
    if (!value || value.trim() === '') {
      return message;
    }
    return null;
  };
