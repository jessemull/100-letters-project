import { DeepKeys, NestedValidatorObject, PathValidator } from '@ts-types/form';

export function flattenValidators<T>(
  nested: NestedValidatorObject<T>,
  parentKey = '',
): PathValidator<T> {
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
}

export function get<T, K extends DeepKeys<T>>(obj: T, path: K): any {
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj);
}

export function set<T, K extends DeepKeys<T>>(obj: T, path: K, value: any): T {
  const keys = path.split('.');
  const lastKey = keys.pop()!;

  const copy: any = { ...obj };
  let curr = copy;

  for (const key of keys) {
    curr[key] = { ...curr[key] };
    curr = curr[key];
  }

  curr[lastKey] = value;
  return copy;
}
