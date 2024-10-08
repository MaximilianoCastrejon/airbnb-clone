import jwt from "jsonwebtoken";
import { PRICE_LOCK_SECRET } from "../config.js";
/**
 * Creates JWT that lets the user book a listing at the quoted price within 2 hours of getting to checkout
 * without risking price changes while at checkout
 * @param {*} payload
 * @returns {Promise}
 */
export function generatePriceLockToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      PRICE_LOCK_SECRET,
      { expiresIn: 60 * 60 * 60 * 2 },
      (err, token) => {
        if (err) reject("JWT failed");
        resolve(token);
      }
    );
  });
}
