import type { Request, Response, NextFunction } from "express";
import { BaseController } from "@core/http/BaseController.js";
import { validate } from "@core/validation/validator.js";
import { UrlBody, UrlBodySchema } from "./dto.js";
import { ScanService } from "./scanService.js";

export class ScanController extends BaseController {
  constructor(private readonly service: ScanService) {
    super();
  }

  ping = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(UrlBodySchema, req.body);
      const result = await this.service.ping(body as UrlBody);
      return this.ok(res, result);
    }
  );

  robotsTxt = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(UrlBodySchema, req.body);
      const result = await this.service.robotsTxt(body as UrlBody);
      return this.ok(res, result);
    }
  );

  siteMap = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(UrlBodySchema, req.body);
      const result = await this.service.siteMap(body as UrlBody);
      return this.ok(res, result);
    }
  );

  crawling = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(UrlBodySchema, req.body);
      const result = await this.service.crawling(body as UrlBody);
      return this.ok(res, result);
    }
  );
}
