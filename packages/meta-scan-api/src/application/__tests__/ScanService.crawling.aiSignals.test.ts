import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanService } from "@/application/ScanService.js";
import type {
  BrowserAutomationPort,
  PuppeteerProcess,
} from "@/domain/ports/BrowserAutomationPort.js";

// crawling() drives the full Puppeteer page API (goto/content/evaluate/close), well beyond the
// launch/close the port interface types — same test-double shape used implicitly by the rest of
// ScanService's tests, made explicit here since this is the first test to exercise `crawling()`
// itself (issue #6 ai-signals-checklist; #3/#5's aiSignals-adjacent groups only got domain-level
// coverage, no crawling()-level test existed before this).
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
  hasIconLink: true, // skip the favicon-fallback HEAD request — not this test's concern
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

describe("ScanService.crawling — aiSignals (issue #6 ai-signals-checklist)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches /.well-known/prompts.txt in parallel with the original HTML fetch and marks promptsTxt pass with its byte count", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("/.well-known/prompts.txt")) {
        return textResponse(
          200,
          "https://example.com/.well-known/prompts.txt",
          "allow: *"
        );
      }
      // original-HTML fetch (fetchFirstHtml)
      return textResponse(200, url, "<html><body>first</body></html>");
    });

    const { browser } = fakeBrowser(baseExtracted);
    const chrome: BrowserAutomationPort = {
      launch: vi.fn().mockResolvedValue(browser),
      close: vi.fn(),
    };

    const result = await new ScanService(chrome).crawling({
      url: "https://example.com",
    });

    // Both requests happened — same fetch() call, not a 5th dedicated API route (ADR-003).
    const requestedUrls = fetchMock.mock.calls.map((c) => c[0]);
    expect(requestedUrls).toContain("https://example.com");
    expect(
      requestedUrls.some((u: string) => u.includes("/.well-known/prompts.txt"))
    ).toBe(true);

    expect(result.extract.promptsTxt).toEqual({ exists: true, byteCount: 8 });
    expect(result.checks.aiSignals).toContainEqual({
      id: "promptsTxt",
      status: "pass",
      detail: 8,
    });
  });

  it("marks promptsTxt info when the fetch 404s, and composes the rest of checks.aiSignals from structuredDataTypes/deltaRatio", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("/.well-known/prompts.txt")) {
        return textResponse(404, url, "");
      }
      return textResponse(200, url, "<html><body>first</body></html>");
    });

    const { browser } = fakeBrowser({
      ...baseExtracted,
      structuredDataTypes: ["WebPage", "FAQPage", "PromptObject"],
    });
    const chrome: BrowserAutomationPort = {
      launch: vi.fn().mockResolvedValue(browser),
      close: vi.fn(),
    };

    const result = await new ScanService(chrome).crawling({
      url: "https://example.com",
    });

    expect(result.extract.promptsTxt).toEqual({ exists: false });
    expect(result.extract.structuredDataTypes).toEqual([
      "WebPage",
      "FAQPage",
      "PromptObject",
    ]);
    expect(result.checks.aiSignals).toEqual([
      { id: "promptsTxt", status: "info" },
      { id: "promptObject", status: "pass" },
      { id: "structuredData", status: "pass" },
      { id: "faqSection", status: "pass" },
      {
        id: "jsRenderDelta",
        status: expect.any(String),
        detail: result.html.deltaRatio,
      },
    ]);
  });
});
