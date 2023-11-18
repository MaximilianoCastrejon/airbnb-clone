import AppError from "./app-error.js";

class BadRequestError extends AppError {
  constructor(message = "Bad request.", statusCode = 400) {
    super(message, statusCode);
  }
}

export { BadRequestError };
