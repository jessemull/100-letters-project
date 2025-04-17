export type Validator = (value: any) => string | null;

export type FormData = Record<string, any>;

type Prev = [never, 0, 1, 2, 3, 4, 5];

export type DeepKeys<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends object
          ? K | `${K}.${DeepKeys<T[K], Prev[D]>}`
          : K;
      }[keyof T & string]
    : never;

export type DeepValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? T[K] extends object
      ? DeepValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type PathValidator<T> = {
  [K in DeepKeys<T>]?: Validator[];
};

export type NestedValidatorObject<T> = {
  [K in keyof T]?: T[K] extends object
    ? NestedValidatorObject<T[K]>
    : Validator[];
};

export type UseFormOptions<T> = {
  initial: T;
  validators: PathValidator<T> | NestedValidatorObject<T>;
  validateOnInit?: boolean;
};
