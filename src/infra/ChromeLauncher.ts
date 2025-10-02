import * as chromeLauncher from "chrome-launcher";

export type ChromeProcess = chromeLauncher.LaunchedChrome;

export class ChromeLauncher {
  async launch(): Promise<chromeLauncher.LaunchedChrome> {
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
