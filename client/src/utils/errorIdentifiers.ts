import * as _err from '../interfaces/error.interfaces';
import { isAxiosError } from 'axios';
import { ErrorConfig } from '../hooks/useError';

type IdentifyFunctionParams = {
  error: any | null;
  config: ErrorConfig;
};

type IdentifierFunction = (
  error: IdentifyFunctionParams['error'],
  config: IdentifyFunctionParams['config']
) => _err.CustomError | null;

const errorIdentifierChain: IdentifierFunction[] = [
  identifyHTTError,
  identifyJavaScriptError,
  identifyAxiosError,
  identifyCORSError,
  identifyMediaError,
  identifyMemoryError,
  identifyDOMError,
  identifyPermissionError,
  identifyWorkerError,
  identifyValidationError
];

const identifyError = (
  error: any,
  config?: Partial<ErrorConfig>
): _err.CustomError => {
  const newConfig = {
    context: config?.context || '',
    element: config?.element || HTMLElement,
    flag: { isRequestError: config?.flag?.isRequestError ?? false }
  } as ErrorConfig;

  const defaultError = {
    type: 'ErrorMessage',
    context: newConfig.context,
    error: error,
    subType: 'NONE'
  } as _err.ErrorMessageInterface;

  if (error === null) return defaultError;

  for (const identifier of errorIdentifierChain) {
    const result = identifier(error, newConfig);
    if (result) return result;
  }

  return defaultError;
};

function identifyJavaScriptError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  if (error === null) return null;
  if (error instanceof _err.JavaScriptError) {
    return {
      ...error,
      subType: error.subType || error.name,
      context: error.message
    } as _err.JavaScriptErrorInterface;
  }
  if (
    _err.JSErrorSubtypesArray.includes(error.name ?? '') &&
    config.flag.isRequestError === false
  ) {
    // Checking for the flag isRequestError because both Fetch and JS can throw TypeErrors
    const subType = error.name as _err.JavaScriptErrorSubtype;
    const stack = error.stack || '';
    const message = error.message;
    return {
      type: 'JavaScriptError',
      subType,
      context: config.context,
      error: { stack, message }
    } as _err.JavaScriptErrorInterface;
  }
  return null;
}

function identifyMediaError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  if (error instanceof _err.MediaErrorObj) {
    return {
      ...error,
      context: error.message
    } as _err.MediaErrorInterface;
  }
  if (error instanceof MediaError) {
    let subType: _err.MediaErrorSubtype;
    let context = config.context;
    const mediaElement = config.element;
    switch (error.code) {
      case 1:
        subType = 'MEDIA_ERR_ABORTED';
        context = context || _err.MediaErrorMessages[subType];
        break;
      case 2:
        subType = 'MEDIA_ERR_NETWORK';
        context = context || _err.MediaErrorMessages[subType];
        break;
      case 3:
        subType = 'MEDIA_ERR_DECODE';
        context = context || _err.MediaErrorMessages[subType];
        break;
      case 4:
        subType = 'MEDIA_ERR_SRC_NOT_SUPPORTED';
        context = context || _err.MediaErrorMessages[subType];
        break;
      default:
        subType = 'UNKNOWN_MEDIA_ERROR';
        context = context || _err.MediaErrorMessages[subType];
    }
    const mediaElementDetails =
      mediaElement !== undefined && mediaElement instanceof HTMLMediaElement
        ? {
            mediaElement,
            mediaSource: mediaElement.currentSrc,
            currentTime: mediaElement.currentTime,
            bufferedTimeRanges: mediaElement.buffered,
            networkState: mediaElement.networkState
          }
        : null;
    return {
      type: 'MediaError',
      subType,
      context,
      error: { message: error.message, ...mediaElementDetails }
    } as _err.MediaErrorInterface;
  }
  return null;
}

function identifyCORSError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  if (error instanceof _err.CORSError) {
    const value: _err.CORSErrorInterface = {
      ...error,
      context: error.message
    };
    return { ...value };
  }
  if (
    error.message &&
    (error.message.includes('CORS') ||
      error.message.includes('Access-Control-Allow-Origin'))
  ) {
    const origin = error.origin || '';
    return {
      type: 'CORSError',
      context: config.context,
      error: {
        message: error.message,
        origin
      }
    } as _err.CORSErrorInterface;
  }
  return null;
}

function identifyAxiosError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  if (error instanceof _err.AxiosErrorObj) {
    const value: _err.AxiosErrorInterface = {
      ...error,
      context: error.message
    };
    return { ...value } as _err.AxiosErrorInterface;
  }
  if (!isAxiosError(error)) return null;
  if (error.response) {
    const res = error.response;
    const status = res.status || 500;
    const statusText = res.statusText || 'InternalServerError';
    const url = res.config.url || undefined;
    const method = res.config.method || undefined;
    const data = res.data;
    const headers = res.headers;
    const subType = error.code || 'UNKNOWN_AXIOS_ERROR';
    return {
      type: 'AxiosError',
      subType,
      context: config.context,
      error: {
        message: error.message,
        config: { url, method },
        response: {
          data: data,
          status: status,
          headers,
          statusText
        }
      }
    } as _err.AxiosErrorInterface;
  } else if (error.request) {
    return {
      type: 'AxiosError',
      subType: 'UNKNOWN_AXIOS_ERROR',
      context:
        config.context ||
        'No response from server. Cause could not be determined. Check CORS policy, Network, URL, or if the request was aborted',
      error: { ...error }
    } as _err.AxiosErrorInterface;
  }
  return null;
}

function identifyMemoryError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  const setSubType = (errorMessage: string): _err.MemoryErrorSubtype | null => {
    const subType = errorMessage.includes('Out of memory')
      ? 'OutOfMemory'
      : error.message.includes('heap')
      ? 'HeapOutOfMemory'
      : null;
    return subType;
  };

  if (error instanceof _err.MemoryError) {
    const subType = setSubType(error.error.message);
    if (subType === null) return null;
    const value: _err.MemoryErrorInterface = {
      ...error,
      subType: error.subType || subType,
      context: error.message
    };
    return { ...value } as _err.MemoryErrorInterface;
  }
  const subType = setSubType(error.message || '');
  if (subType === null) return null;
  return {
    type: 'MemoryError',
    subType,
    context: config.context,
    error: { message: error.message }
  } as _err.MemoryErrorInterface;
  // return null;
}
// flag 'isRequestError' required because JS Errors and Fetching Errors throw "TypeError"s
function identifyHTTError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  if (error instanceof _err.HTTPError) {
    const value: _err.HTTPErrorInterface = {
      ...error,
      context: error.message
    };
    return { ...value };
  }

  if (error instanceof TypeError && config.flag.isRequestError === true) {
    return {
      type: 'HTTPError',
      context:
        'No response from server. Cause could not be determined. Check CORS policy, Network, URL, or if the request was aborted',
      error: { message: error.message } // If a coder used a simple Error throw, this would be set to the message that the coder set there
    } as _err.HTTPErrorInterface;
  }

  return null;
}

function identifyDOMError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  // Check if the error is a DOMException
  if (error instanceof _err.DOMError) {
    const value: _err.DOMErrorInterface = {
      ...error,
      context: error.message
    };
    return { ...value };
  }
  if (!(error instanceof DOMException)) return null;

  let subType: _err.DOMExceptionSubtype =
    (error.name as _err.DOMExceptionSubtype) || 'UNKNOWN_DOM_EXCEPTION'; // Default subtype
  const context = config.context || _err.DOMExceptionMessages[subType];
  const element = config.element;
  const elementDetails =
    element !== undefined
      ? {
          id: element.id || 'No ID',
          classList: element.className || 'No classes',
          tagName: element.tagName,
          attributes: [...element.attributes].map((attr) => ({
            name: attr.name,
            value: attr.value
          })),
          innerHTML: element.innerHTML || 'No content',
          value: (element as HTMLInputElement).value || undefined
        }
      : {};
  // Return the structured CustomError object
  return {
    type: 'DOMError',
    subType,
    context,
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack || 'No stack trace available',
      elementDetails: elementDetails
    }
  } as _err.DOMErrorInterface;
}

function identifyPermissionError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  if (error instanceof _err.PermissionError) {
    const value: _err.PermissionErrorInterface = {
      ...error,
      context: error.message
    };
    return { ...value };
  }
  if (!error || !(error.name && error.name.includes('Permission'))) return null;

  const context = config.context;
  let deviceType: _err.PermissionErrorDeviceTypes | undefined = undefined;

  if (navigator.mediaDevices) {
    deviceType = 'Media Device';
  } else if (navigator.geolocation) {
    deviceType = 'Geolocation';
  } else if (error.message.includes('camera')) {
    deviceType = 'Camera';
  } else if (error.message.includes('microphone')) {
    deviceType = 'Microphone';
  } else {
    deviceType = 'Unknown Device';
  }

  return {
    type: 'PermissionError',
    context: context || 'Permission to access the device was denied.',
    error: {
      message: error.message || 'Permission error occurred.',
      name: error.name,
      deviceType
    }
  } as _err.PermissionErrorInterface;
}

function identifyWorkerError(
  error: any,
  config: ErrorConfig
): _err.CustomError | null {
  if (error instanceof _err.WorkerError) {
    const value: _err.WorkerErrorInterface = {
      ...error,
      context: error.message
    };
    return { ...value };
  }
  if (!(error instanceof Error)) return null;

  let context = config.context;
  let workerType: string | undefined = undefined;

  if (error.name === 'WorkerError') {
    workerType = 'General Worker Error';
    context = context || 'A worker encountered an error.';
  } else if (error.message.includes('failed to load')) {
    workerType = 'Failed to Load Worker';
    context = context || 'The worker script failed to load.';
  } else if (error.message.includes('terminate')) {
    workerType = 'Worker Termination';
    context = context || 'The worker was terminated unexpectedly.';
  }

  return {
    type: 'WorkerError',
    context: context || 'An unknown worker error occurred.',
    error: {
      message: error.message,
      workerType
    }
  } as _err.WorkerErrorInterface;
}

function identifyValidationError(error: any): _err.CustomError | null {
  if (error instanceof _err.ValidationError) {
    const value = {
      ...error,
      context: error.message
    } as _err.ValidationErrorInterface;
    return value;
  }
  return null;
}

export default identifyError;
