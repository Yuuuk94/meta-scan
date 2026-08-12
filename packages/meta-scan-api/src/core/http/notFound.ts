import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError.js";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound());
}
