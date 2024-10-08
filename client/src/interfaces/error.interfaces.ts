import { AxiosResponse } from 'axios';

export type CustomError =
  | JavaScriptErrorInterface
  | AxiosErrorInterface
  | DOMErrorInterface
  | HTTPErrorInterface
  | CORSErrorInterface
  | PermissionErrorInterface
  | MemoryErrorInterface
  | WorkerErrorInterface
  | MediaErrorInterface
  | ErrorMessageInterface
  | ValidationErrorInterface;

export type ErrorTypes = keyof typeof HandledErrorTypes;

export const HandledErrorTypes = {
  JavaScriptError: 'JavaScriptError',
  AxiosError: 'AxiosError',
  MemoryError: 'MemoryError',
  MediaError: 'MediaError',
  DOMError: 'DOMError',
  HTTPError: 'HTTPError',
  CORSError: 'CORSError',
  PermissionError: 'PermissionError',
  WorkerError: 'WorkerError',
  ErrorMessage: 'ErrorMessage',
  ValidationError: 'ValidationError',
  UnknownError: 'UnknownError'
} as const;

/*
--------------------------------------------------
          Handled Error types to throw
--------------------------------------------------
*/
/*
--------------------------------------------------
ErrorMessage
--------------------------------------------------
*/
export interface ErrorMessageInterface {
  type: typeof HandledErrorTypes.ErrorMessage;
  context: string;
  subType: 'NONE';
  error: any; // set to 'any' in order to accomodate for errors with a know cause but unknown signature
}
export class ErrorMessage extends Error {
  type = HandledErrorTypes.ErrorMessage;
  subType = 'NONE';
  error: any;
  constructor(error: any, message: string) {
    super(message);
    this.error = error;
  }
}

/*
--------------------------------------------------
JavaScriptError
--------------------------------------------------
*/
interface JavaScriptErrorDetails {
  message: string;
  stack?: string;
}
export interface JavaScriptErrorInterface {
  type: typeof HandledErrorTypes.JavaScriptError;
  context: string;
  subType: JavaScriptErrorSubtype | Error['name'];
  error: JavaScriptErrorDetails;
}
export class JavaScriptError extends Error {
  subType?: JavaScriptErrorSubtype | undefined;
  type = HandledErrorTypes.JavaScriptError;
  error: JavaScriptErrorDetails;
  constructor(
    error: JavaScriptErrorDetails,
    message?: string,
    subType?: JavaScriptErrorSubtype
  ) {
    super(message);
    this.subType = subType || undefined;
    this.error = error;
  }
}

/*
--------------------------------------------------
AxiosError
--------------------------------------------------
*/
interface AxiosErrorDetails {
  message?: string;

  config?: { url: string; method: string };
  response?: {
    status: number;
    statusText: string;
    data?: any;
    headers: AxiosResponse['headers'];
  };
  request?: any;
  cause?: Error;
  stack?: string;
}
export interface AxiosErrorInterface {
  type: typeof HandledErrorTypes.AxiosError;
  context: string;
  subType: AxiosErrorSubtype;
  error: AxiosErrorDetails;
}
export class AxiosErrorObj extends Error {
  subType: AxiosErrorSubtype;
  type = HandledErrorTypes.AxiosError;
  error: AxiosErrorDetails;
  constructor(
    error: AxiosErrorDetails,
    subType: AxiosErrorSubtype,
    message?: string
  ) {
    super(message);
    this.subType = subType;
    this.error = error;
  }
}

/*
--------------------------------------------------
MemoryError
--------------------------------------------------
*/
interface MemoryErrorDetails {
  message: string;
  memoryUsage?: any;
}
export interface MemoryErrorInterface {
  type: typeof HandledErrorTypes.MemoryError;
  context: string;
  subType: MemoryErrorSubtype;
  error: MemoryErrorDetails;
}
export class MemoryError extends Error {
  subType: MemoryErrorSubtype;
  type = HandledErrorTypes.MemoryError;
  error: MemoryErrorDetails;
  constructor(
    error: MemoryErrorDetails,
    subType: MemoryErrorSubtype,
    message?: string
  ) {
    super(message);
    this.subType = subType;
    this.error = error;
  }
}

/*
--------------------------------------------------
MediaError
--------------------------------------------------
*/
interface MediaErrorDetails {
  message: string;
  mediaElement?: HTMLMediaElement;
  mediaSource?: string;
  currentTime?: number;
  bufferedTimeRanges?: TimeRanges;
  networkState?: number;
}
export interface MediaErrorInterface {
  type: typeof HandledErrorTypes.MediaError;
  context: string;
  subType: MediaErrorSubtype;
  error: MediaErrorDetails;
}
export class MediaErrorObj extends Error {
  subType: MediaErrorSubtype;
  type = HandledErrorTypes.MediaError;
  error: MediaErrorDetails;
  constructor(error: MediaErrorDetails, subType?: MediaErrorSubtype) {
    super(MediaErrorMessages[subType || 'UNKNOWN_MEDIA_ERROR']);
    this.subType = subType || 'UNKNOWN_MEDIA_ERROR';
    this.error = error;
  }
}

/*
--------------------------------------------------
DOMError
--------------------------------------------------
*/
interface DOMErrorDetails {
  message: string;
  stack?: string;
  elementDetails?: {
    id: HTMLElement['id'] | 'No ID';
    classList: HTMLElement['className'] | 'No classes';
    tagName: HTMLElement['tagName'];
    attributes: [
      {
        name: string;
        value: string;
      }
    ];
    innerHTML: HTMLElement['innerHTML'] | 'No content';
    value: HTMLInputElement['value'] | undefined | {};
  };
}
export interface DOMErrorInterface {
  type: typeof HandledErrorTypes.DOMError;
  context: string;
  subType: DOMExceptionSubtype;
  error: DOMErrorDetails;
}
export class DOMError extends Error {
  subType: DOMExceptionSubtype;
  type = HandledErrorTypes.DOMError;
  error: DOMErrorDetails;
  constructor(error: DOMErrorDetails, subType?: DOMExceptionSubtype) {
    super(DOMExceptionMessages[subType || 'UNKNOWN_DOM_EXCEPTION']);
    this.subType = subType || 'UNKNOWN_DOM_EXCEPTION';
    this.error = error;
  }
}

/*
--------------------------------------------------
HTTPError
--------------------------------------------------
*/
interface HTTPErrorDetails {
  message?: string;
  type?: string;
  status?: number;
  statusText?: string;
  errorDetails?: any;
  url?: string;
}
export interface HTTPErrorInterface {
  type: typeof HandledErrorTypes.HTTPError;
  context: string;
  subType: 'NONE';
  error: HTTPErrorDetails;
}
export class HTTPError extends Error {
  subType: 'NONE' = 'NONE';
  type = HandledErrorTypes.HTTPError;
  error: HTTPErrorDetails;
  constructor(error: HTTPErrorDetails, context?: string) {
    super(context);
    this.error = error;
  }
}

/*
--------------------------------------------------
CORSError
--------------------------------------------------
*/
interface CORSErrorDetails {
  message: string;
  origin?: string;
  targetURL?: string;
  headers?: Record<string, string>;
}
export interface CORSErrorInterface {
  type: typeof HandledErrorTypes.CORSError;
  context: string;
  subType: 'NONE';
  error: CORSErrorDetails;
}
export class CORSError extends Error {
  subType: 'NONE' = 'NONE';
  type = HandledErrorTypes.CORSError;
  error: CORSErrorDetails;
  constructor(error: CORSErrorDetails, context?: string) {
    super(context);
    this.error = error;
  }
}

/*
--------------------------------------------------
PermissionError
--------------------------------------------------
*/
interface PermissionErrorDetails {
  message: string;
  name?: string;
  deviceType?: PermissionErrorDeviceTypes;
}
export interface PermissionErrorInterface {
  type: typeof HandledErrorTypes.PermissionError;
  context: string;
  subType: 'NONE';
  error: PermissionErrorDetails;
}
export class PermissionError extends Error {
  subType: 'NONE' = 'NONE';
  type = HandledErrorTypes.PermissionError;
  error: PermissionErrorDetails;
  constructor(error: PermissionErrorDetails, message?: string) {
    super(message);
    this.error = error;
  }
}

/*
--------------------------------------------------
WorkerError
--------------------------------------------------
*/
interface WorkerErrorDetails {
  message: string;
  workerType?: string;
}
export interface WorkerErrorInterface {
  type: typeof HandledErrorTypes.WorkerError;
  context: string;
  subType: 'NONE';
  error: WorkerErrorDetails;
}
export class WorkerError extends Error {
  subType: 'NONE' = 'NONE';
  type = HandledErrorTypes.WorkerError;
  error: WorkerErrorDetails;
  constructor(error: WorkerErrorDetails, message?: string) {
    super(message || 'No message');
    this.error = error;
  }
}

/*
--------------------------------------------------
ValidationError
--------------------------------------------------
*/
interface ValidationErrorDetails {
  expected: string | {};
  actual: string | {};
}
export interface ValidationErrorInterface {
  type: 'ValidationError';
  subType: 'NONE';
  context: string;
  error: ValidationErrorDetails;
}
export class ValidationError extends Error {
  subType: 'NONE' = 'NONE';
  type = HandledErrorTypes.ValidationError;
  error: ValidationErrorDetails;
  constructor(error: ValidationErrorDetails, message?: string) {
    super(message || 'No message');
    this.error = error;
  }
}

export type JavaScriptErrorSubtype = (typeof JSErrorSubtypesArray)[number];
export type MemoryErrorSubtype = (typeof MemoryErrorSubtypesArray)[number];
export type MediaErrorSubtype = (typeof MediaErrorSubtypesArray)[number];
export type AxiosErrorSubtype = (typeof AxiosErrorSubtypesArray)[number];
export type DOMExceptionSubtype = (typeof DOMExceptionSubtypesArray)[number];

export const JSErrorSubtypesArray = [
  'SyntaxError',
  'ReferenceError',
  'TypeError',
  'RangeError',
  'EvalError',
  'URIError'
] as const;
export const MemoryErrorSubtypesArray = [
  'OutOfMemory',
  'HeapOutOfMemory'
] as const;
export const MediaErrorSubtypesArray = [
  'MEDIA_ERR_ABORTED',
  'MEDIA_ERR_NETWORK',
  'MEDIA_ERR_DECODE',
  'MEDIA_ERR_SRC_NOT_SUPPORTED',
  'UNKNOWN_MEDIA_ERROR'
] as const;

export const AxiosErrorSubtypesArray = [
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ERR_NETWORK',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL',
  'ERR_CANCELED',
  'ECONNABORTED',
  'ETIMEDOUT',
  'UNKNOWN_AXIOS_ERROR'
] as const;

export const DOMExceptionSubtypesArray = [
  'INDEX_SIZE_ERR',
  'DOMSTRING_SIZE_ERR',
  'HIERARCHY_REQUEST_ERR',
  'WRONG_DOCUMENT_ERR',
  'INVALID_CHARACTER_ERR',
  'NO_DATA_ALLOWED_ERR',
  'NO_MODIFICATION_ALLOWED_ERR',
  'NOT_FOUND_ERR',
  'NOT_SUPPORTED_ERR',
  'INUSE_ATTRIBUTE_ERR',
  'INVALID_STATE_ERR',
  'SYNTAX_ERR',
  'INVALID_MODIFICATION_ERR',
  'NAMESPACE_ERR',
  'INVALID_ACCESS_ERR',
  'VALIDATION_ERR',
  'TYPE_MISMATCH_ERR',
  'SECURITY_ERR',
  'NETWORK_ERR',
  'ABORT_ERR',
  'URL_MISMATCH_ERR',
  'QUOTA_EXCEEDED_ERR',
  'TIMEOUT_ERR',
  'INVALID_NODE_TYPE_ERR',
  'DATA_CLONE_ERR',
  'UNKNOWN_DOM_EXCEPTION'
] as const;

export const DOMExceptionMessages: { [key in DOMExceptionSubtype]: string } = {
  INDEX_SIZE_ERR: 'The index is not in the allowed range.',
  DOMSTRING_SIZE_ERR: 'The specified text is too long.',
  HIERARCHY_REQUEST_ERR: 'The operation would yield an incorrect node tree.',
  WRONG_DOCUMENT_ERR: 'The object is in the wrong document context.',
  INVALID_CHARACTER_ERR: 'The string contains invalid characters.',
  NO_DATA_ALLOWED_ERR: 'No data is allowed here.',
  NO_MODIFICATION_ALLOWED_ERR: 'The object cannot be modified in this way.',
  NOT_FOUND_ERR: 'The object could not be found.',
  NOT_SUPPORTED_ERR: 'The operation is not supported.',
  INUSE_ATTRIBUTE_ERR: 'The attribute is in use by another element.',
  INVALID_STATE_ERR: 'The object is in an invalid state.',
  SYNTAX_ERR: 'The string contains a syntax error.',
  INVALID_MODIFICATION_ERR: 'The object cannot be modified in this way.',
  NAMESPACE_ERR: 'The operation is not allowed in this namespace.',
  INVALID_ACCESS_ERR: 'The operation is not allowed.',
  VALIDATION_ERR: 'The object did not pass validation checks.',
  TYPE_MISMATCH_ERR: 'The object type does not match the expected type.',
  SECURITY_ERR: 'A security error occurred.',
  NETWORK_ERR: 'A network error occurred during the operation.',
  ABORT_ERR: 'The operation was aborted.',
  URL_MISMATCH_ERR: 'The URL does not match the required format.',
  QUOTA_EXCEEDED_ERR: 'The operation exceeded the quota.',
  TIMEOUT_ERR: 'The operation timed out.',
  INVALID_NODE_TYPE_ERR: 'The node type is invalid.',
  DATA_CLONE_ERR: 'The data cannot be cloned.',
  UNKNOWN_DOM_EXCEPTION: 'An unknown DOMException occurred.'
} as const;

export type PermissionErrorDeviceTypes =
  | 'Media Device'
  | 'Geolocation'
  | 'Camera'
  | 'Microphone'
  | 'Unknown Device';

export const MediaErrorMessages: { [key in MediaErrorSubtype]: string } = {
  MEDIA_ERR_ABORTED:
    'The fetching process for the media resource was aborted by the user.',
  MEDIA_ERR_NETWORK:
    'A network error occurred while fetching the media resource.',
  MEDIA_ERR_DECODE: 'An error occurred while decoding the media resource.',
  MEDIA_ERR_SRC_NOT_SUPPORTED: 'The media resource format is not supported.',
  UNKNOWN_MEDIA_ERROR: 'An unknown media error occurred.'
} as const;
