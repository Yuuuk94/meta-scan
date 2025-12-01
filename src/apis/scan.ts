import { instance } from ".";

export const sitePingApi = async (data: UrlData) =>
  await instance.post<SiteStatus>("/api/v1/scan/ping", data);

export const scanRobotsTxtApi = async (data: UrlData) =>
  await instance.post<any>(
    process.env.NEXT_PUBLIC_META_SCAN_API + "/api/v1/scan/robotsTxt",
    data
  );

export const scanSiteMapApi = async (data: UrlData) =>
  await instance.post(
    process.env.NEXT_PUBLIC_META_SCAN_API + "/api/v1/scan/siteMap",
    data
  );

export const scanCrawlingApi = async (data: UrlData) =>
  await instance.post<any>(
    process.env.NEXT_PUBLIC_META_SCAN_API + "/api/v1/scan/crawling",
    data
  );

export const lsRunApi = async (data: UrlData) =>
  await instance.post<any>(
    process.env.NEXT_PUBLIC_META_SCAN_API + "/api/v1/lighthouse/run",
    {
      url: data.url,
      formFactor: "mobile",
      onlyCategories: ["seo", "performance"],
      format: "json",
    }
  );
