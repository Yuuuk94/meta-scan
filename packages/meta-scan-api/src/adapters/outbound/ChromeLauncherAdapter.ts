import * as chromeLauncher from "chrome-launcher";
import type {
  ChromeProcess,
  LighthouseRunnerPort,
} from "@/domain/ports/LighthouseRunnerPort.js";

export class ChromeLauncherAdapter implements LighthouseRunnerPort {
  async launch(): Promise<ChromeProcess> {
    const chrome = await chromeLauncher.launch({
      ...(process.env.CHROME_PATH
        ? { chromePath: process.env.CHROME_PATH }
        : {}),
      chromeFlags: [
        "--headless=new",
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--ignore-certificate-errors",
      ],
    });
    return chrome;
  }

  async safeKill(proc?: ChromeProcess) {
    if (!proc) return;
    try {
      proc.kill();
    } catch {}
  }
}
