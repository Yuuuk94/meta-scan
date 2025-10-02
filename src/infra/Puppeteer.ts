import puppeteer from "puppeteer";

export class Puppeteer {
  async launch(): Promise<puppeteer.Browser> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Cloud Run 등 컨테이너 환경에서 필수
    });

    return browser;
  }

  async close(proc?: puppeteer.Browser) {
    if (!proc) return;
    try {
      proc.close();
    } catch {}
  }
}
