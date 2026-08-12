import type { Request, Response, NextFunction } from "express";

export abstract class BaseController {
  protected ok<T>(res: Response, payload?: T) {
    if (payload === undefined) return res.sendStatus(200);
    return res.status(200).json(payload);
  }
  protected html(res: Response, html: string) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  }
  // 공통 핸들러 래핑 (try/catch 생략을 위한 헬퍼)
  protected handle(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }
}
