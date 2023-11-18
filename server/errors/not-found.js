import AppError from "./app-error.js";

class NotFoundError extends AppError {
  constructor(message = "Resource not found", statusCode = 404) {
    super(message, statusCode);
  }
}

export { NotFoundError };
