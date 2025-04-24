import { useState, useMemo } from 'react';
import { get, set, flattenValidators } from '@util/form';
import {
  DeepKeys,
  DeepValue,
  FormData,
  UseFormOptions,
  NestedValidatorObject,
  Validator,
} from '@ts-types/form';

export function useForm<T extends FormData>({
  initial,
  validators: nestedValidators,
  validateOnInit = false,
}: UseFormOptions<T>) {
  const [values, _setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<DeepKeys<T>, string[]>>>(
    {},
  );
  const [dirty, setDirty] = useState<Partial<Record<DeepKeys<T>, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validators = useMemo(() => {
    return flattenValidators(nestedValidators as NestedValidatorObject<T>);
  }, [nestedValidators]);

  const updateField = <K extends DeepKeys<T>>(
    path: K,
    value: DeepValue<T, K>,
  ) => {
    _setValues((prev) => set(prev, path, value));

    setDirty((prev) => ({
      ...prev,
      [path]: get(values, path) !== value,
    }));

    if (validators[path] && (validateOnInit || hasSubmitted)) {
      validateField(path, value);
    }
  };

  const validateField = <K extends DeepKeys<T>>(
    path: K,
    value?: DeepValue<T, K>,
  ) => {
    const val = value ?? get(values, path);
    const rules = validators[path];

    const errs = (rules as Validator[])
      .map((v) => v(val))
      .filter((e): e is string => e !== null);

    setErrors((prev) => {
      const updated = { ...prev };
      if (errs.length > 0) updated[path] = errs;
      else delete updated[path];
      return updated;
    });
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<DeepKeys<T>, string[]>> = {};

    for (const path in validators) {
      const val = get(values, path as DeepKeys<T>);

      const errs = (validators[path as DeepKeys<T>] as Validator[])
        .map((v) => v(val))
        .filter((e): e is string => e !== null);

      if (errs.length > 0) {
        newErrors[path as DeepKeys<T>] = errs;
        isValid = false;
      }
    }

    setErrors(newErrors);

    return isValid;
  };

  const onSubmit = (callback: (values: T) => void) => {
    setHasSubmitted(true);
    if (validate()) callback(values);
  };

  const setValues = (newValues: T) => {
    _setValues(newValues);
    setDirty({});
    if (validateOnInit || hasSubmitted) {
      Object.keys(validators).forEach((path) => {
        const val = get(newValues, path as DeepKeys<T>);
        validateField(path as DeepKeys<T>, val);
      });
    }
  };

  const isDirty = useMemo(() => Object.values(dirty).some(Boolean), [dirty]);
  const isValid = useMemo(
    () => Object.values(errors).every((err) => (err as string[]).length === 0),
    [errors],
  );

  return {
    dirty,
    errors,
    isDirty,
    isValid,
    onSubmit,
    setValues,
    updateField,
    values,
  };
}
