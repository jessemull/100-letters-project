import { Validator } from '@ts-types/form';

const asTrimmedString = (value: unknown): string | null =>
  typeof value === 'string' ? value.trim() : null;

export const required =
  (message: string = 'Required'): Validator =>
  (value) => {
    const trimmed = asTrimmedString(value);
    if (!trimmed) {
      return message;
    }
    return null;
  };

export const maxLength =
  (max: number, message: string): Validator =>
  (value) => {
    const trimmed = asTrimmedString(value);
    if (trimmed === null) return message;
    return trimmed.length > max ? message : null;
  };

export const minLength =
  (min: number, message: string): Validator =>
  (value) => {
    const trimmed = asTrimmedString(value);
    if (trimmed === null) return message;
    return trimmed.length < min ? message : null;
  };

export const isEmail =
  (message: string): Validator =>
  (value) => {
    const trimmed = asTrimmedString(value);
    if (trimmed === null) return message;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed) ? null : message;
  };
