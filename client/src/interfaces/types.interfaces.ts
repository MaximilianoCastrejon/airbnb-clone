// Intermediate mapped type to extract keys of type string
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Extract keys of Booking interface where the type is string
export type StringKeys<T> = Exclude<KeysOfType<T, string>, undefined>;
export type NumericKeys<T> = Exclude<KeysOfType<T, number | Date>, undefined>;
