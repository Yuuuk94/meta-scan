import puppeteer from "puppeteer";
import type {
  BrowserAutomationPort,
  PuppeteerProcess,
} from "@/domain/ports/BrowserAutomationPort.js";

export class PuppeteerAdapter implements BrowserAutomationPort {
  async launch(): Promise<PuppeteerProcess> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Cloud Run 등 컨테이너 환경에서 필수
    });

    return browser;
  }

  async close(proc?: PuppeteerProcess) {
    if (!proc) return;
    try {
      proc.close();
    } catch {}
  }
}
