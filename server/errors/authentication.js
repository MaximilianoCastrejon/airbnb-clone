import AppError from "./app-error.js";

class AuthenticationError extends AppError {
  constructor(message = "Authentication failed", statusCode = 401) {
    super(message, statusCode);
  }
}

export { AuthenticationError };
