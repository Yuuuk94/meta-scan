import { statusOk } from "@constant/status.js";
import { BaseController } from "@core/http/BaseController.js";
import type { Request, Response, NextFunction } from "express";

export class HealthController extends BaseController {
  get = this.handle(
    async (_req: Request, res: Response, _next: NextFunction) => {
      return this.ok(res, statusOk);
    }
  );
}
