import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError.js";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof ApiError ? err.status : 500;
  const message = err?.message || "Unexpected error";
  const body: any = { error: message };
  if (process.env.NODE_ENV === "development" && err?.stack)
    body.stack = err.stack;
  res.status(status).json(body);
}
