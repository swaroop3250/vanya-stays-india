import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET || "change-me-access-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "change-me-refresh-secret";
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret);
