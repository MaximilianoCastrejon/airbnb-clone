import AppError from "./app-error.js";

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access.", statusCode = 401) {
    super(message, statusCode);
  }
}

export { UnauthorizedError };
