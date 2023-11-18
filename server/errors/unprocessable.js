import AppError from "./app-error.js";

class UnprocessableError extends AppError {
  constructor(
    message = "The requiredField is undefined or missing.",
    statusCode = 422
  ) {
    super(message, statusCode);
  }
}

export { UnprocessableError };
