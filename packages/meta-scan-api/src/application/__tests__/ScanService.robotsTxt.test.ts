import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanService } from "@/application/ScanService.js";
import type { BrowserAutomationPort } from "@/domain/ports/BrowserAutomationPort.js";

const stubBrowser: BrowserAutomationPort = {
  launch: vi.fn(),
  close: vi.fn(),
};

function service() {
  return new ScanService(stubBrowser);
}

function textResponse(status: number, url: string, body: string) {
  return {
    status,
    url,
    redirected: false,
    text: async () => body,
  } as Response;
}

describe("ScanService.robotsTxt (issue #4 indexing-checklist)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks sitemapDeclaredInRobots as pass when robots.txt declares at least one sitemap", async () => {
    fetchMock.mockResolvedValueOnce(
      textResponse(
        200,
        "https://example.com/robots.txt",
        "User-agent: *\nDisallow:\nSitemap: https://example.com/sitemap.xml\n"
      )
    );

    const result = await service().robotsTxt({ url: "https://example.com" });

    expect(result.checks.indexing).toEqual([
      { id: "sitemapDeclaredInRobots", status: "pass" },
    ]);
  });

  it("marks sitemapDeclaredInRobots as info when robots.txt exists but declares no sitemap", async () => {
    fetchMock.mockResolvedValueOnce(
      textResponse(
        200,
        "https://example.com/robots.txt",
        "User-agent: *\nDisallow:\n"
      )
    );

    const result = await service().robotsTxt({ url: "https://example.com" });

    expect(result.checks.indexing).toEqual([
      { id: "sitemapDeclaredInRobots", status: "info" },
    ]);
  });

  it("marks sitemapDeclaredInRobots as info when robots.txt doesn't exist at all", async () => {
    fetchMock.mockResolvedValueOnce(
      textResponse(404, "https://example.com/robots.txt", "")
    );

    const result = await service().robotsTxt({ url: "https://example.com" });

    expect(result.has).toBe(false);
    expect(result.checks.indexing).toEqual([
      { id: "sitemapDeclaredInRobots", status: "info" },
    ]);
  });
});
