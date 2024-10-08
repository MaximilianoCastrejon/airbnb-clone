import { ValidationError } from '../interfaces/error.interfaces';
import { RequiredKeys } from '../interfaces/types.interfaces';

/**
 *
 * @param obj Object to validate
 * @param requiredFields Array of fields required in signature of interface/type T
 * @returns resolve(Same input object now verified) | reject(An Error with the expected signature, the actual signature and a message)
 */
export default function validateForm<T>(
  obj: Partial<T>,
  requiredFields: RequiredKeys<T>[]
): Promise<T> {
  const missingFields = requiredFields.filter((field) => {
    return obj[field] === undefined;
  });

  const promise = new Promise<T>((resolve, reject) => {
    if (missingFields.length > 0)
      reject(
        new ValidationError(
          {
            expected: `${requiredFields.toString()}`,
            actual: `${JSON.stringify(obj)}`
          },
          `Missing required fields: ${missingFields.join(', ')}`
        )
      );
    resolve(obj as T);
  });
  return promise;
}
