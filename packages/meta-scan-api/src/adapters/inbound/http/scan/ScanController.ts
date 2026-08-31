import type { Request, Response, NextFunction } from "express";
import { BaseController } from "@/core/http/BaseController.js";
import { validate } from "@/core/validation/validator.js";
import { SiteMapBody, SiteMapBodySchema, UrlBody, UrlBodySchema } from "./dto.js";
import { ScanService } from "@/application/ScanService.js";
import { statusOk } from "@/constant/status.js";

export class ScanController extends BaseController {
  constructor(private readonly service: ScanService) {
    super();
  }

  ping = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(UrlBodySchema, req.body);
      const result = await this.service.ping(body as UrlBody);
      return this.ok(res, { ...statusOk, ...result });
    }
  );

  robotsTxt = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(UrlBodySchema, req.body);
      const result = await this.service.robotsTxt(body as UrlBody);
      return this.ok(res, { ...statusOk, ...result });
    }
  );

  siteMap = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(SiteMapBodySchema, req.body);
      const result = await this.service.siteMap(body as SiteMapBody);
      return this.ok(res, { ...statusOk, ...result });
    }
  );

  crawling = this.handle(
    async (req: Request, res: Response, _next: NextFunction) => {
      const body = validate(UrlBodySchema, req.body);
      const result = await this.service.crawling(body as UrlBody);
      return this.ok(res, { ...statusOk, ...result });
    }
  );
}
