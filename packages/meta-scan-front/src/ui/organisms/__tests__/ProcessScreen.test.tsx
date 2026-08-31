import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { ProcessScreen } from "@/ui/organisms/ProcessScreen";
import { useScanStore } from "@/stores/scanStore";
import {
  lsRunApi,
  scanCrawlingApi,
  scanRobotsTxtApi,
  scanSiteMapApi,
} from "@/api/scanApi";

const replace = jest.fn();
const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push }),
}));

jest.mock("@/api/scanApi", () => ({
  scanRobotsTxtApi: jest.fn(),
  scanSiteMapApi: jest.fn(),
  scanCrawlingApi: jest.fn(),
  lsRunApi: jest.fn(),
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
  checks: { basicSeo: [], indexing: [] },
};

const okRes = <T,>(data: T) => Promise.resolve({ data } as { data: T });
const failRes = () => Promise.reject(new Error("network error"));

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  useScanStore.setState({ results: {} });
});

describe("ProcessScreen", () => {
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
      <ProcessScreen lang="ko" theme="dark" t={t} siteStatus={siteStatus} />
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

  it("renders ErrorScreen instead of routing when sitemap/crawling/lighthouse all fail", async () => {
    (scanRobotsTxtApi as jest.Mock).mockReturnValue(
      okRes<RobotsTxtData>({ status: "ok", has: true })
    );
    (scanSiteMapApi as jest.Mock).mockReturnValue(failRes());
    (scanCrawlingApi as jest.Mock).mockReturnValue(failRes());
    (lsRunApi as jest.Mock).mockReturnValue(failRes());

    render(
      <ProcessScreen lang="ko" theme="dark" t={t} siteStatus={siteStatus} />
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
      <ProcessScreen lang="ko" theme="dark" t={t} siteStatus={siteStatus} />
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
