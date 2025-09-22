import lighthouse from "lighthouse";
import type { RunBody } from "./dto.js";
import type { ChromeProcess } from "@infra/ChromeLauncher.js";
import { ChromeLauncher } from "@infra/ChromeLauncher.js";

export class LighthouseService {
  constructor(private readonly chrome: ChromeLauncher) {}

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
