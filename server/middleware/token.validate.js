import * as jwt from "jsonwebtoken";
import * as async_errors from "./error-handler.middleware";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return new async_errors.UnauthorizedError("Token missing");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) throw new async_errors.UnauthorizedError("Token not valid");
    req.user = decoded;
  });
  next();
};
