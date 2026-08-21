import lighthouse from "lighthouse";
// NOTE(ADR-011): application importing an inbound-adapter DTO type is a known impurity this
// migration pass didn't resolve — see docs/case-study/backend-hexagonal-architecture.md §5.
import type { RunBody } from "@/adapters/inbound/http/lighthouse/dto.js";
import type {
  ChromeProcess,
  LighthouseRunnerPort,
} from "@/domain/ports/LighthouseRunnerPort.js";
import { ApiError } from "@/core/http/ApiError.js";

export class LighthouseService {
  constructor(private readonly chrome: LighthouseRunnerPort) {}

  async run({ url, formFactor, onlyCategories, format }: RunBody) {
    let proc: ChromeProcess | undefined;
    try {
      proc = await this.chrome.launch();
      const flags = {
        port: proc.port,
        logLevel: "error" as const,
        emulatedFormFactor: formFactor,
        onlyCategories,
        output: format,
      };
      const result = await lighthouse(url, flags);
      return result;
    } catch (e) {
      throw ApiError.internal();
    } finally {
      await this.chrome.safeKill(proc);
    }
  }

  toSafeFilename(url: string) {
    const safe = url
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    return `lighthouse-${safe}-${ts}`;
  }
}
