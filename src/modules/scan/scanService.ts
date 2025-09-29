import { ApiError } from "@core/http/ApiError.js";
import type { RunBody } from "./dto.js";

export class ScanService {
  constructor() {}

  async ping({ url }: RunBody) {
    try {
      const result = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      });
      if (result.status === 200) {
        return true;
      }
      throw Error;
    } catch (e) {
      throw ApiError.internal();
    }
  }
}
