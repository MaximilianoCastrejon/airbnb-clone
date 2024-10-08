// iterate T.
// field K from type T extends U ? return field K : turn field into never type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
// Exclude fields turned to never
export type StringKeys<T> = Exclude<KeysOfType<T, string>, undefined>;
export type NumericKeys<T> = Exclude<KeysOfType<T, number | Date>, undefined>;

export type RequiredKeys<T> = {
  // Exlude optional fields from mapping
  // Only return fields that cannot be assigned to an empy object
  [K in keyof T]-?: {} extends Pick<T, K>
    ? never
    : undefined extends T[K]
    ? never
    : K;
}[keyof T];
