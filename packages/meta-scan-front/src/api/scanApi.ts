import { instance } from "./instance";

export const sitePingApi = async (data: UrlData) =>
  await instance.post<SiteStatusData>("/api/v1/scan/ping", data);

export const scanRobotsTxtApi = async (data: UrlData) =>
  await instance.post<RobotsTxtData>("/api/v1/scan/robotsTxt", data);

// `candidateSitemaps` (issue #4 indexing-checklist req #1) — the frontend
// forwards robots.txt's already-fetched declared sitemap URLs so the
// backend can HEAD-check fallback locations without re-fetching/
// re-parsing robots.txt itself (spec decision log #3, ADR-003 4-API
// independence). Optional: robotsTxt may not declare any.
export const scanSiteMapApi = async (
  data: UrlData & { candidateSitemaps?: string[] }
) => await instance.post<SiteMapData>("/api/v1/scan/siteMap", data);

export const scanCrawlingApi = async (data: UrlData) =>
  await instance.post<CrawlingScanData>("/api/v1/scan/crawling", data);

export const lsRunApi = async (data: UrlData) =>
  await instance.post<LighthouseData>("/api/v1/lighthouse/run", {
    url: data.url,
    formFactor: "mobile",
    onlyCategories: ["performance", "seo", "best-practices", "accessibility"],
    format: "json",
  });
