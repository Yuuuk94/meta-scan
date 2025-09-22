import * as chromeLauncher from "chrome-launcher";

export interface ChromeProcess {
  port: number;
  kill: () => Promise<void>;
}

export class ChromeLauncher {
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
    return chrome as unknown as ChromeProcess;
  }

  async safeKill(proc?: ChromeProcess) {
    if (!proc) return;
    try {
      proc.kill();
    } catch {}
  }
}
