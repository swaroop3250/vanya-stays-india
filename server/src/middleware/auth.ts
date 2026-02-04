import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/tokens";
import { HttpError } from "../utils/httpError";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError("Missing authorization token", 401));
  }

  const token = header.replace("Bearer ", "").trim();
  try {
    const payload = verifyAccessToken(token) as { userId: string; email: string };
    req.user = { id: payload.userId, email: payload.email };
    return next();
  } catch {
    return next(new HttpError("Invalid or expired token", 401));
  }
};
