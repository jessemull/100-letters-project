import { required, maxLength, minLength, isEmail } from './validators';

describe('validators', () => {
  describe('required', () => {
    it('Returns null for non-empty string.', () => {
      expect(required()('hello')).toBeNull();
    });

    it('Returns error message for empty string.', () => {
      expect(required()('')).toBe('Required');
    });

    it('Returns error message for string with only whitespace.', () => {
      expect(required()('   ')).toBe('Required');
    });

    it('Allows custom error message.', () => {
      expect(required('Must fill this in')('')).toBe('Must fill this in');
    });
  });

  describe('maxLength', () => {
    it('Returns null when value is within max length.', () => {
      expect(maxLength(5, 'Too long')('abc')).toBeNull();
    });

    it('Returns error message when value exceeds max length.', () => {
      expect(maxLength(3, 'Too long')('abcdef')).toBe('Too long');
    });

    it('Trims value before checking length.', () => {
      expect(maxLength(3, 'Too long')('   ab  ')).toBeNull();
      expect(maxLength(3, 'Too long')('   abcd  ')).toBe('Too long');
    });
  });

  describe('minLength', () => {
    it('Returns null when value meets min length.', () => {
      expect(minLength(3, 'Too short')('hello')).toBeNull();
    });

    it('Returns error message when value is too short.', () => {
      expect(minLength(5, 'Too short')('abc')).toBe('Too short');
    });

    it('Trims value before checking length.', () => {
      expect(minLength(3, 'Too short')('   a  ')).toBe('Too short');
      expect(minLength(3, 'Too short')('   abc  ')).toBeNull();
    });
  });

  describe('isEmail', () => {
    it('Returns null for valid email.', () => {
      expect(isEmail('Invalid email')('user@example.com')).toBeNull();
    });

    it('Returns error message for invalid email formats.', () => {
      expect(isEmail('Invalid email')('not-an-email')).toBe('Invalid email');
      expect(isEmail('Invalid email')('user@')).toBe('Invalid email');
      expect(isEmail('Invalid email')('@domain.com')).toBe('Invalid email');
      expect(isEmail('Invalid email')('user@com')).toBe('Invalid email');
    });

    it('Trims value before validation.', () => {
      expect(isEmail('Invalid email')('   user@example.com   ')).toBeNull();
    });
  });
});
