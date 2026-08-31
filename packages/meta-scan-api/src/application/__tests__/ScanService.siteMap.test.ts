import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanService } from "@/application/ScanService.js";
import type { BrowserAutomationPort } from "@/domain/ports/BrowserAutomationPort.js";

// siteMap doesn't touch the browser automation port at all — a stub satisfying the interface
// shape is enough (mirrors the port doc's "test double only needs to satisfy these 2 methods").
const stubBrowser: BrowserAutomationPort = {
  launch: vi.fn(),
  close: vi.fn(),
};

function service() {
  return new ScanService(stubBrowser);
}

function headResponse(status: number, url: string, redirected = false) {
  return { status, url, redirected } as Response;
}

describe("ScanService.siteMap (issue #4 indexing-checklist)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks sitemapExists as pass and has=true when /sitemap.xml itself returns 200", async () => {
    fetchMock.mockResolvedValueOnce(
      headResponse(200, "https://example.com/sitemap.xml")
    );

    const result = await service().siteMap({ url: "https://example.com" });

    expect(result.has).toBe(true);
    expect(result.checks.indexing).toEqual([
      { id: "sitemapExists", status: "pass" },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to candidateSitemaps in order and marks pass when one of them returns 200", async () => {
    fetchMock
      .mockResolvedValueOnce(headResponse(404, "https://example.com/sitemap.xml"))
      .mockResolvedValueOnce(
        headResponse(404, "https://example.com/sitemap_index.xml")
      )
      .mockResolvedValueOnce(
        headResponse(200, "https://example.com/sitemaps/main.xml")
      );

    const result = await service().siteMap({
      url: "https://example.com",
      candidateSitemaps: [
        "https://example.com/sitemap_index.xml",
        "https://example.com/sitemaps/main.xml",
      ],
    });

    expect(result.has).toBe(true);
    expect(result.url).toBe("https://example.com/sitemaps/main.xml");
    expect(result.checks.indexing).toEqual([
      { id: "sitemapExists", status: "pass" },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("stops checking candidates once one succeeds", async () => {
    fetchMock
      .mockResolvedValueOnce(headResponse(404, "https://example.com/sitemap.xml"))
      .mockResolvedValueOnce(headResponse(200, "https://example.com/a.xml"));

    await service().siteMap({
      url: "https://example.com",
      candidateSitemaps: ["https://example.com/a.xml", "https://example.com/b.xml"],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("marks sitemapExists as warning and has=false when the primary check and every candidate fail", async () => {
    fetchMock
      .mockResolvedValueOnce(headResponse(404, "https://example.com/sitemap.xml"))
      .mockResolvedValueOnce(headResponse(404, "https://example.com/a.xml"));

    const result = await service().siteMap({
      url: "https://example.com",
      candidateSitemaps: ["https://example.com/a.xml"],
    });

    expect(result.has).toBe(false);
    expect(result.checks.indexing).toEqual([
      { id: "sitemapExists", status: "warning" },
    ]);
  });

  it("marks sitemapExists as warning when the primary check fails and no candidateSitemaps were given", async () => {
    fetchMock.mockResolvedValueOnce(
      headResponse(404, "https://example.com/sitemap.xml")
    );

    const result = await service().siteMap({ url: "https://example.com" });

    expect(result.has).toBe(false);
    expect(result.checks.indexing).toEqual([
      { id: "sitemapExists", status: "warning" },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("treats a candidate fetch that throws as a miss and keeps trying the rest", async () => {
    fetchMock
      .mockResolvedValueOnce(headResponse(404, "https://example.com/sitemap.xml"))
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce(headResponse(200, "https://example.com/b.xml"));

    const result = await service().siteMap({
      url: "https://example.com",
      candidateSitemaps: ["https://example.com/a.xml", "https://example.com/b.xml"],
    });

    expect(result.has).toBe(true);
    expect(result.checks.indexing).toEqual([
      { id: "sitemapExists", status: "pass" },
    ]);
  });
});
