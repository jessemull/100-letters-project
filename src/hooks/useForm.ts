import { useState, useMemo } from 'react';
import { FormData, Validator } from '../types';

export function useForm<T extends FormData>(
  initial: T,
  validators: Record<keyof T, Validator[] | undefined>,
) {
  // Keeps track of dirty fields.

  const [dirty, setDirty] = useState<Record<keyof T, boolean>>(
    Object.keys(initial).reduce(
      (acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      },
      {} as Record<keyof T, boolean>,
    ),
  );

  // Keeps track of errors as an array for each field.

  const [errors, setErrors] = useState<Record<keyof T, string[]>>(
    Object.keys(initial).reduce(
      (acc, key) => {
        acc[key as keyof T] = [];
        return acc;
      },
      {} as Record<keyof T, string[]>,
    ),
  );

  // The form values.

  const [values, setValues] = useState<T>(initial);

  const updateField = (field: keyof T, value: T[keyof T]) => {
    // Set the new value.

    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Mark it as dirty if it changed. Check against the initial values. Remove key if the field is equal to the initial state.

    setDirty((prev) => {
      const updated = { ...prev };
      if (value !== initial[field]) {
        updated[field] = true;
      } else {
        delete updated[field]; // Remove key if not dirty
      }
      return updated;
    });

    // Validate the field if a validator exists for it.

    if (validators[field]) {
      validateField(field, value);
    }
  };

  const validateField = (field: keyof T, value: T[keyof T]) => {
    // Fire all the validators and return all error messages.

    const fieldErrors = validators[field]!.map((validator) =>
      validator(value),
    ).filter((error) => error !== null) as string[];

    // Remove any keys without errors.

    setErrors((prev) => {
      const updated = { ...prev };
      if (fieldErrors.length > 0) {
        updated[field] = fieldErrors;
      } else {
        delete updated[field];
      }
      return updated;
    });
  };

  // Validates all fields.

  const validate = () => {
    let isValid = true;
    Object.keys(values).forEach((field) => {
      const key = field as keyof T;
      const value = values[key];
      if (validators[key]) {
        const fieldErrors = validators[key]!.map((validator) =>
          validator(value),
        ).filter((error) => error !== null) as string[];
        if (fieldErrors.length > 0) {
          setErrors((prev) => {
            const updated = { ...prev };
            updated[key] = fieldErrors;
            return updated;
          });
          isValid = false;
        } else {
          setErrors((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
          });
        }
      }
    });
    return isValid;
  };

  // Submit handler takes a callback and fires it if the form is in a valid state.

  const onSubmit = (callback: (values: T) => void) => {
    if (validate()) {
      callback(values);
    }
  };

  const isDirty = useMemo(() => Object.values(dirty).includes(true), [dirty]);

  const isValid = useMemo(
    () => !Object.values(errors).some((err) => err.length > 0),
    [errors],
  );

  return {
    dirty,
    errors,
    isDirty,
    isValid,
    onSubmit,
    updateField,
    values,
  };
}
