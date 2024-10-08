import * as jwt from "jsonwebtoken";
import * as async_errors from "./error-handler.middleware.js";
import { PRICE_LOCK_SECRET } from "../config.js";

export const priceLock = (req, res, next) => {
  const { price_locked_token } = req.cookies;
  if (!price_locked_token)
    return new async_errors.UnauthorizedError("Token missing");
  jwt.verify(price_locked_token, PRICE_LOCK_SECRET, (err, decoded) => {
    if (err) throw new async_errors.UnauthorizedError("Token not valid");
    req.user_id = decoded.user_id;
    req.listing_id = decoded.listing_id;
    req.totalCost = decoded.totalCost;
    req.valid_code_ids = decoded.valid_code_ids;
  });
  next();
};
