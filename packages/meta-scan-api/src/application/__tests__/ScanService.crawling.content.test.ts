import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanService } from "@/application/ScanService.js";
import type {
  BrowserAutomationPort,
  PuppeteerProcess,
} from "@/domain/ports/BrowserAutomationPort.js";

// Same test-double shape as ScanService.crawling.aiSignals.test.ts (issue #6) — `page.evaluate` is
// mocked wholesale to return a canned extraction result, since the actual DOM-extraction closure
// runs in-browser and isn't unit-testable here (same boundary the rest of ScanService's
// extraction — h1/images/structuredDataTypes — already has no dedicated extraction-level test
// for).
function fakeBrowser(extracted: Record<string, unknown>) {
  const page = {
    goto: vi.fn().mockResolvedValue({ url: () => "https://example.com/" }),
    content: vi.fn().mockResolvedValue("<html><body>onload</body></html>"),
    evaluate: vi.fn().mockResolvedValue(extracted),
    close: vi.fn().mockResolvedValue(undefined),
  };
  const browser = {
    newPage: vi.fn().mockResolvedValue(page),
  };
  return { browser: browser as unknown as PuppeteerProcess, page };
}

const baseExtracted = {
  title: "Example",
  description: "desc",
  keywords: undefined,
  canonical: undefined,
  canonicalLinks: [],
  metaRobots: undefined,
  hasIconLink: true,
  h1: ["Example"],
  images: { total: 0, altMissing: 0 },
  openGraph: {},
  twitter: {},
  duplicates: { metaName: [], metaProperty: [] },
  structuredDataTypes: [] as string[],
};

function textResponse(status: number, url: string, body: string) {
  return { status, url, redirected: false, text: async () => body } as Response;
}

describe("ScanService.crawling — content (issue #7 content-stats-checklist)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("/.well-known/prompts.txt")) return textResponse(404, url, "");
      return textResponse(200, url, "<html><body>first</body></html>");
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("composes checks.content from the DOM extraction's charCount/headings/tldr fields", async () => {
    const { browser } = fakeBrowser({
      ...baseExtracted,
      h1: ["Example"],
      charCount: 1340,
      headings: { h1: 1, h2: 6, h3: 12 },
      hasTldr: true,
    });
    const chrome: BrowserAutomationPort = {
      launch: vi.fn().mockResolvedValue(browser),
      close: vi.fn(),
    };

    const result = await new ScanService(chrome).crawling({
      url: "https://example.com",
    });

    expect(result.checks.content).toEqual([
      { id: "headings", status: "pass", detail: { h1: 1, h2: 6, h3: 12 } },
      { id: "charCount", status: "pass", detail: 1340 },
      { id: "tldr", status: "pass" },
    ]);
  });

  it("marks a too-short body / no h2-h3 under a lone h1 / missing TL;DR as warning/warning/info", async () => {
    const { browser } = fakeBrowser({
      ...baseExtracted,
      h1: ["Example"],
      charCount: 80,
      headings: { h1: 1, h2: 0, h3: 0 },
      hasTldr: false,
    });
    const chrome: BrowserAutomationPort = {
      launch: vi.fn().mockResolvedValue(browser),
      close: vi.fn(),
    };

    const result = await new ScanService(chrome).crawling({
      url: "https://example.com",
    });

    expect(result.checks.content).toEqual([
      { id: "headings", status: "warning", detail: { h1: 1, h2: 0, h3: 0 } },
      { id: "charCount", status: "warning", detail: 80 },
      { id: "tldr", status: "info" },
    ]);
  });
});
