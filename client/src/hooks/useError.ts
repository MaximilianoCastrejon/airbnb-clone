import { CustomError } from '../interfaces/error.interfaces';
import { useState } from 'react';
import identifyError from '../utils/errorIdentifiers';

export interface ErrorConfig {
  /**
   * Information about the context for an error thrown
   * Tells valuable information to the user about what to do next
   */
  context: string;
  /**
   * Flag to differentiate between JS and request errors that throw the same TypeErrors
   */
  flag: { isRequestError: boolean };
  /**
   * To gather information about
   */
  element: HTMLElement | undefined;
}
export type UpdateFunction = (
  error: any | null,
  config?: Partial<ErrorConfig>
) => void;

const useCustomError = (): [CustomError | null, UpdateFunction] => {
  const [error, setError] = useState<CustomError | null>(null);

  const updateError = (error: any | null, config?: Partial<ErrorConfig>) => {
    if (error === null) setError(null);
    const identifiedError = identifyError(error, config);
    setError(identifiedError);
  };

  return [error, updateError];
};

export default useCustomError;
