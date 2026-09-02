import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanService } from "@/application/ScanService.js";
import type {
  BrowserAutomationPort,
  PuppeteerProcess,
} from "@/domain/ports/BrowserAutomationPort.js";

// Same test-double shape as ScanService.crawling.content.test.ts (issue #7) — `page.evaluate` is
// mocked wholesale to return a canned extraction result, since the actual DOM-extraction closure
// runs in-browser and isn't unit-testable here.
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
  charCount: 1340,
  headings: { h1: 1, h2: 6, h3: 12 },
  hasTldr: true,
  images: { total: 0, altMissing: 0 },
  openGraph: {},
  twitter: {},
  duplicates: { metaName: [], metaProperty: [] },
  structuredDataTypes: [] as string[],
};

function textResponse(status: number, url: string, body: string) {
  return { status, url, redirected: false, text: async () => body } as Response;
}

describe("ScanService.crawling — i18nUx (issue #8 i18n-ux-checklist)", () => {
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

  it("composes checks.i18nUx from the DOM extraction's hasHreflang/hasViewport fields", async () => {
    const { browser } = fakeBrowser({
      ...baseExtracted,
      hasHreflang: true,
      hasViewport: true,
    });
    const chrome: BrowserAutomationPort = {
      launch: vi.fn().mockResolvedValue(browser),
      close: vi.fn(),
    };

    const result = await new ScanService(chrome).crawling({
      url: "https://example.com",
    });

    expect(result.checks.i18nUx).toEqual([
      { id: "hreflang", status: "pass" },
      { id: "viewport", status: "pass" },
    ]);
  });

  it("marks missing hreflang as info and missing viewport as warning", async () => {
    const { browser } = fakeBrowser({
      ...baseExtracted,
      hasHreflang: false,
      hasViewport: false,
    });
    const chrome: BrowserAutomationPort = {
      launch: vi.fn().mockResolvedValue(browser),
      close: vi.fn(),
    };

    const result = await new ScanService(chrome).crawling({
      url: "https://example.com",
    });

    expect(result.checks.i18nUx).toEqual([
      { id: "hreflang", status: "info" },
      { id: "viewport", status: "warning" },
    ]);
  });
});
