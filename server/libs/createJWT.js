import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      { expiresIn: 60 * 60 * 3 },
      (err, token) => {
        if (err) reject("JWT failed");
        resolve(token);
      }
    );
  });
}
