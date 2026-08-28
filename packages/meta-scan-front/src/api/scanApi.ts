import { instance } from "./instance";

export const sitePingApi = async (data: UrlData) =>
  await instance.post<SiteStatusData>("/api/v1/scan/ping", data);

export const scanRobotsTxtApi = async (data: UrlData) =>
  await instance.post<RobotsTxtData>("/api/v1/scan/robotsTxt", data);

export const scanSiteMapApi = async (data: UrlData) =>
  await instance.post<SiteMapData>("/api/v1/scan/siteMap", data);

export const scanCrawlingApi = async (data: UrlData) =>
  await instance.post<unknown>("/api/v1/scan/crawling", data);

export const lsRunApi = async (data: UrlData) =>
  await instance.post<unknown>("/api/v1/lighthouse/run", {
    url: data.url,
    formFactor: "mobile",
    onlyCategories: ["performance", "seo", "best-practices", "accessibility"],
    format: "json",
  });
