import {
  DeepKeys,
  DeepValue,
  NestedValidatorObject,
  PathValidator,
} from '@ts-types/form';

export const flattenValidators = <T>(
  nested: NestedValidatorObject<T>,
  parentKey = '',
): PathValidator<T> => {
  const flat: PathValidator<T> = {};
  for (const key in nested) {
    const value = nested[key];
    const fullPath = parentKey ? `${parentKey}.${key}` : key;
    if (Array.isArray(value)) {
      flat[fullPath as DeepKeys<T>] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flat, flattenValidators(value, fullPath));
    }
  }
  return flat;
};

export const get = <T, K extends DeepKeys<T>>(
  obj: T,
  path: K,
): DeepValue<T, K> =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object' && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as DeepValue<T, K>;

export const set = <T, K extends DeepKeys<T>>(
  obj: T,
  path: K,
  value: DeepValue<T, K>,
): T => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const copy = { ...obj } as Record<string, unknown>;
  let curr: Record<string, unknown> = copy;
  for (const key of keys) {
    const next = curr[key];
    curr[key] =
      next !== null && typeof next === 'object'
        ? { ...(next as Record<string, unknown>) }
        : {};
    curr = curr[key] as Record<string, unknown>;
  }
  curr[lastKey] = value;
  return copy as T;
};
