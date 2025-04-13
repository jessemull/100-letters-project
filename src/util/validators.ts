import { Validator } from '@ts-types/form';

export const required =
  (message: string = 'Required'): Validator =>
  (value) => {
    if (!value || value.trim() === '') {
      return message;
    }
    return null;
  };

export const maxLength =
  (max: number, message: string): Validator =>
  (value) => {
    return value.trim().length > max ? message : null;
  };

export const minLength =
  (min: number, message: string): Validator =>
  (value) => {
    return value.trim().length < min ? message : null;
  };

export const isEmail =
  (message: string): Validator =>
  (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim()) ? null : message;
  };
