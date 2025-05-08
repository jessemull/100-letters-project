import { renderHook, act } from '@testing-library/react';
import { useForm } from '@hooks/useForm';
import { Validator } from '@ts-types/form';

type TestForm = {
  email: string;
  age: number;
};

const required: Validator = (value) => (value ? null : 'Required');

const mustBeEmail: Validator = (value) =>
  typeof value === 'string' && /\S+@\S+\.\S+/.test(value)
    ? null
    : 'Invalid email';

const mustBeAdult: Validator = (value) =>
  typeof value === 'number' && value >= 18 ? null : 'Must be 18+';

describe('useForm', () => {
  const initial = { email: '', age: 0 };
  const validators = {
    email: [required, mustBeEmail],
    age: [required, mustBeAdult],
  };

  it('Initializes with correct default state.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators }),
    );

    expect(result.current.values).toEqual(initial);
    expect(result.current.errors).toEqual({});
    expect(result.current.dirty).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it('Marks field as dirty and updates value.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators }),
    );

    act(() => {
      result.current.updateField('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
    expect(result.current.dirty.email).toBe(true);
    expect(result.current.isDirty).toBe(true);
  });

  it('Removes dirty field if value is reset to initial.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators }),
    );

    act(() => {
      result.current.updateField('email', 'test@example.com');
      result.current.updateField('email', '');
    });

    expect(result.current.dirty.email).toBe(false);
    expect(result.current.isDirty).toBe(false);
  });

  it('Does not validate until submitted or validateOnInit is true.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators }),
    );

    act(() => {
      result.current.updateField('email', 'bademail');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('Validates field when validateOnInit is true.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators, validateOnInit: true }),
    );

    act(() => {
      result.current.updateField('email', 'invalid-email');
    });

    expect(result.current.errors.email).toContain('Invalid email');
  });

  it('Validates on submit and runs callback if valid.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators }),
    );

    const onSubmit = jest.fn();

    act(() => {
      result.current.updateField('email', 'test@example.com');
      result.current.updateField('age', 25);
    });

    act(() => {
      result.current.onSubmit(onSubmit);
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      age: 25,
    });
  });

  it('Does not run callback if form is invalid.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators }),
    );

    const onSubmit = jest.fn();

    act(() => {
      result.current.updateField('email', 'bad');
      result.current.updateField('age', 10);
    });

    act(() => {
      result.current.onSubmit(onSubmit);
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toContain('Invalid email');
    expect(result.current.errors.age).toContain('Must be 18+');
    expect(result.current.isValid).toBe(false);
  });

  it('Clears errors if field becomes valid.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators, validateOnInit: true }),
    );

    act(() => {
      result.current.updateField('email', 'invalid');
    });

    expect(result.current.errors.email).toContain('Invalid email');

    act(() => {
      result.current.updateField('email', 'valid@email.com');
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.isValid).toBe(true);
  });

  it('Falls back to get(values, path) when value is undefined in validateField.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators, validateOnInit: true }),
    );

    act(() => {
      result.current.updateField('email', 'invalid');
    });

    act(() => {
      result.current.updateField('email', undefined as unknown as string);
    });

    expect(result.current.errors.email).toContain('Invalid email');
  });

  it('Skips validation silently when no validators are defined for a field.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initial,
        validators: { email: [required] },
        validateOnInit: true,
      }),
    );

    act(() => {
      result.current.updateField('age', 42);
    });

    expect(result.current.errors.age).toBeUndefined();
  });

  it('Falls back to empty array when validating fields with no rules in validate.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initial,
        validators: { email: [] },
        validateOnInit: true,
      }),
    );

    act(() => {
      result.current.updateField('email', 'whatever@example.com');
    });

    act(() => {
      result.current.onSubmit(jest.fn());
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.isValid).toBe(true);
  });

  it('Triggers validation when setValues is called after submit.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators }),
    );

    act(() => {
      result.current.onSubmit(jest.fn());
    });

    act(() => {
      result.current.setValues({ email: 'bad', age: 2 });
    });

    expect(result.current.errors.email).toContain('Invalid email');
    expect(result.current.errors.age).toContain('Must be 18+');
  });

  it('Triggers validation when setValues is called with validateOnInit.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({ initial, validators, validateOnInit: true }),
    );

    act(() => {
      result.current.setValues({ email: 'not-an-email', age: 5 });
    });

    expect(result.current.errors.email).toContain('Invalid email');
    expect(result.current.errors.age).toContain('Must be 18+');
  });

  it('Defaults to empty array of validators if path not in validators (updateField).', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initial,
        validators: {},
        validateOnInit: true,
      }),
    );

    act(() => {
      result.current.updateField('email', 'some@email.com');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('Skips validation silently when validateField is called on a field with no rules.', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initial,
        validators: { email: [required] },
        validateOnInit: false,
      }),
    );

    act(() => {
      result.current.updateField('age', 42);
    });

    expect(result.current.errors.age).toBeUndefined();
  });
});
