import type { Request, Response, NextFunction } from "express";
import { BaseController } from "@core/http/BaseController.js";
import { validate } from "@core/validation/validator.js";
import { RunBody, RunBodySchema } from "./dto.js";

import { ScanService } from "./scanService.js";
import { statusOk } from "@constant/status.js";

export class ScanController extends BaseController {
  constructor(private readonly service: ScanService) {
    super();
  }

  ping = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(RunBodySchema, req.body);
      await this.service.ping(body as RunBody);
      return this.ok(res, statusOk);
    }
  );

  robotsTxt = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(RunBodySchema, req.body);
      const result = await this.service.robotsTxt(body as RunBody);
      return this.ok(res, result);
    }
  );
}
