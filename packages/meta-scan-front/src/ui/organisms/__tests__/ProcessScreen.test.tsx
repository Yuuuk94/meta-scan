import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";

import { ProcessScreen } from "@/ui/organisms/ProcessScreen";
import { useScanStore } from "@/stores/scanStore";
import {
  lsRunApi,
  scanCrawlingApi,
  scanRobotsTxtApi,
  scanSiteMapApi,
  sitePingApi,
} from "@/api/scanApi";
import { trackEvent } from "@/services/analyticsEvents";

const replace = jest.fn();
const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push }),
}));

jest.mock("@/api/scanApi", () => ({
  sitePingApi: jest.fn(),
  scanRobotsTxtApi: jest.fn(),
  scanSiteMapApi: jest.fn(),
  scanCrawlingApi: jest.fn(),
  lsRunApi: jest.fn(),
}));

jest.mock("@/services/analyticsEvents", () => ({
  trackEvent: jest.fn(),
}));

const t = {
  analyzingText: "analyzing",
  analyzingSubtext: "sub",
  steps: ["robots.txt", "sitemap.xml", "crawling", "lighthouse"],
  stepsHint: "hint",
  errorTitle: "error",
  errorSubtitle: "error sub",
  retryButton: "retry",
  goBack: "home",
};

const siteStatus: SiteStatusData = {
  status: "ok",
  url: "https://example.com",
  redirected: false,
};

const crawlingFixture: CrawlingScanData = {
  status: "ok",
  url: siteStatus.url,
  finalUrl: siteStatus.url,
  timingMs: { firstHtml: 10, onload: 20 },
  html: {
    first: { length: 100, sha1: "a" },
    onload: { length: 120, sha1: "b" },
    deltaRatio: 0.2,
  },
  extract: {
    title: "Example Domain",
    h1: [],
    images: { total: 0, altMissing: 0 },
    openGraph: {},
    twitter: {},
    duplicates: { metaName: [], metaProperty: [] },
  },
  checks: {
    basicSeo: [],
    indexing: [],
    previews: [],
    aiSignals: [],
    content: [],
    i18nUx: [],
  },
};

const okRes = <T,>(data: T) => Promise.resolve({ data } as { data: T });
const failRes = () => Promise.reject(new Error("network error"));

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  useScanStore.setState({ results: {} });
  // Ping now runs inside ProcessScreen itself (perf fix, 2026-09-02) —
  // default every test to a resolved ping so existing tests (which only
  // care about what happens after) don't each need their own mock.
  (sitePingApi as jest.Mock).mockReturnValue(okRes<SiteStatusData>(siteStatus));
});

describe("ProcessScreen", () => {
  // perf fix, 2026-09-02 — ping moved from a server-side await (before this
  // component ever mounted) to the component's own first client-side step,
  // so it needs a visible pending state and its own failure handling now.
  it("shows a pending badge while the ping is in flight, then flips to reachable once it resolves", async () => {
    let resolvePing: (value: { data: SiteStatusData }) => void = () => {};
    (sitePingApi as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolvePing = resolve;
      })
    );

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url="https://example.com" />
    );

    expect(screen.getByText("접속 확인 중")).toBeInTheDocument();
    expect(scanRobotsTxtApi).not.toHaveBeenCalled();

    // Badge flips to "reachable" as soon as ping resolves, before robotsTxt
    // is even called — keep robotsTxt pending forever so this test only
    // observes that transition, not the rest of the scan.
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(new Promise(() => {}));

    await act(async () => {
      resolvePing({ data: siteStatus });
    });

    await waitFor(() =>
      expect(screen.getByText("접속 확인 완료")).toBeInTheDocument()
    );
  });

  it("renders ErrorScreen when the ping call itself fails, without calling robotsTxt", async () => {
    (sitePingApi as jest.Mock).mockReturnValue(failRes());

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url="https://example.com" />
    );

    expect(await screen.findByText("error")).toBeInTheDocument();
    expect(scanRobotsTxtApi).not.toHaveBeenCalled();
  });

  it("saves the 4 raw responses + combined result and routes to /scan/:id once sitemap/crawling/lighthouse resolve", async () => {
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({ status: "ok", has: true })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(
      okRes<SiteMapData>({ status: "ok", has: true })
    );
    (scanCrawlingApi as jest.Mock).mockReturnValue(
      okRes<CrawlingScanData>(crawlingFixture)
    );
    (lsRunApi as jest.Mock).mockReturnValue(okRes({ status: "ok" }));

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url={siteStatus.url} />
    );

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));

    const [path] = replace.mock.calls[0];
    expect(path).toMatch(/^\/scan\/[0-9a-f-]{36}$/);

    const id = path.split("/scan/")[1];
    const stored = useScanStore.getState().getScanResult(id);
    expect(stored?.url).toBe("https://example.com");
    expect(stored?.raw.crawling?.extract.title).toBe("Example Domain");
    expect(stored?.combined.title).toBe("Example Domain");
    expect(stored?.combined.failedApis).toEqual([]);
  });

  // issue #19 analytics-integration — scan_completed fires at the same
  // point combineScanResults runs and routing to /scan/:id happens
  // (normal completion path).
  it("fires a scan_completed analytics event on the normal completion path", async () => {
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({ status: "ok", has: true })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(
      okRes<SiteMapData>({ status: "ok", has: true })
    );
    (scanCrawlingApi as jest.Mock).mockReturnValue(
      okRes<CrawlingScanData>(crawlingFixture)
    );
    (lsRunApi as jest.Mock).mockReturnValue(okRes({ status: "ok" }));

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url={siteStatus.url} />
    );

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));

    expect(trackEvent).toHaveBeenCalledWith("scan_completed", {
      url: siteStatus.url,
    });
  });

  it("stores a real lighthouse response even though it has no {status:'ok'} wrapper (issue #9)", async () => {
    // meta-scan-api CLAUDE.md "응답 스프레드 규약과 예외": lighthouse run
    // returns `result?.lhr` directly, unlike the other 3 endpoints — a
    // truthy 2xx body here must count as success, not just one with a
    // `status === "ok"` field.
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({ status: "ok", has: true })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(
      okRes<SiteMapData>({ status: "ok", has: true })
    );
    (scanCrawlingApi as jest.Mock).mockReturnValue(
      okRes<CrawlingScanData>(crawlingFixture)
    );
    (lsRunApi as jest.Mock).mockReturnValue(
      okRes<LighthouseData>({
        lighthouseVersion: "12.8.2",
        categories: {
          performance: { title: "Performance", score: 0.5 },
        },
      })
    );

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url={siteStatus.url} />
    );

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));

    const id = replace.mock.calls[0][0].split("/scan/")[1];
    const stored = useScanStore.getState().getScanResult(id);
    expect(stored?.raw.lighthouse?.categories?.performance?.score).toBe(0.5);
    expect(stored?.combined.failedApis).not.toContain("lighthouse");
    expect(stored?.combined.lighthouse?.scores.performance).toBe(0.5);
  });

  it("forwards robotsTxt's declared sitemap URLs as siteMap's candidateSitemaps (issue #4 req #1)", async () => {
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({
        status: "ok",
        has: true,
        sitemap: ["https://example.com/sitemap-alt.xml"],
      })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(
      okRes<SiteMapData>({ status: "ok", has: true })
    );
    (scanCrawlingApi as jest.Mock).mockReturnValue(
      okRes<CrawlingScanData>(crawlingFixture)
    );
    (lsRunApi as jest.Mock).mockReturnValue(okRes({ status: "ok" }));

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url={siteStatus.url} />
    );

    await waitFor(() => expect(scanSiteMapApi).toHaveBeenCalledTimes(1));
    expect(scanSiteMapApi).toHaveBeenCalledWith({
      url: "https://example.com",
      candidateSitemaps: ["https://example.com/sitemap-alt.xml"],
    });
  });

  it("forwards undefined candidateSitemaps when robotsTxt declares no sitemap", async () => {
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({ status: "ok", has: true })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(
      okRes<SiteMapData>({ status: "ok", has: true })
    );
    (scanCrawlingApi as jest.Mock).mockReturnValue(
      okRes<CrawlingScanData>(crawlingFixture)
    );
    (lsRunApi as jest.Mock).mockReturnValue(okRes({ status: "ok" }));

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url={siteStatus.url} />
    );

    await waitFor(() => expect(scanSiteMapApi).toHaveBeenCalledTimes(1));
    expect(scanSiteMapApi).toHaveBeenCalledWith({
      url: "https://example.com",
      candidateSitemaps: undefined,
    });
  });

  it("renders ErrorScreen instead of routing when sitemap/crawling/lighthouse all fail", async () => {
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({ status: "ok", has: true })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(failRes());
    (scanCrawlingApi as jest.Mock).mockReturnValue(failRes());
    (lsRunApi as jest.Mock).mockReturnValue(failRes());

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url={siteStatus.url} />
    );

    expect(await screen.findByText("error")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("still saves + routes when only some of sitemap/crawling/lighthouse fail, marking the failed ones", async () => {
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({ status: "ok", has: true })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(failRes());
    (scanCrawlingApi as jest.Mock).mockReturnValue(
      okRes<CrawlingScanData>(crawlingFixture)
    );
    (lsRunApi as jest.Mock).mockReturnValue(failRes());

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} url={siteStatus.url} />
    );

    await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
    const id = replace.mock.calls[0][0].split("/scan/")[1];
    const stored = useScanStore.getState().getScanResult(id);
    expect(stored?.combined.failedApis).toEqual(
      expect.arrayContaining(["siteMap", "lighthouse"])
    );
    expect(stored?.combined.failedApis).not.toContain("crawling");
  });
});
