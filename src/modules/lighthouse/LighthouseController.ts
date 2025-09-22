import type { Request, Response, NextFunction } from "express";
import { BaseController } from "@core/http/BaseController.js";
import { validate } from "@core/validation/validator.js";
import { RunBody, RunBodySchema } from "./dto.js";
import { LighthouseService } from "./LighthouseService.js";

export class LighthouseController extends BaseController {
  constructor(private readonly service: LighthouseService) {
    super();
  }

  run = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(RunBodySchema, req.body);
      const result = await this.service.run(body as RunBody);

      if (result && body.format === "html") {
        const html = result.report as unknown as string;
        return this.html(res, html);
      }
      return this.ok(res, result?.lhr);
    }
  );
}
