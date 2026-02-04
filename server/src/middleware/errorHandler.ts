import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError("Route not found", 404));
};

export const errorHandler = (
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};
